#!/usr/bin/env python3
"""Static workshop + short-lived LAN photo handoff. Python 3.9+, no install."""
import argparse
import base64
import binascii
import ipaddress
import json
from pathlib import Path
import re
import secrets
import socket
import subprocess
import sys
import threading
import time
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlsplit

from vendor.qrcodegen import QrCode

ROOT = Path(__file__).resolve().parent
TTL = 600
MAX_BODY = 225000
SESSIONS = {}
LOCK = threading.Lock()


def lan_address():
    # VPNs can own the default route; prefer a real Wi-Fi/Ethernet interface.
    try:
        if sys.platform == 'darwin':
            listing = subprocess.check_output(['/sbin/ifconfig'], text=True, timeout=2)
            for block in re.split(r'(?m)(?=^[a-z][\w]*:)', listing):
                if re.match(r'en\d+:', block) and 'UP,' in block:
                    match = re.search(r'\binet (\d+\.\d+\.\d+\.\d+)', block)
                    if match:
                        return match[1]
        elif sys.platform.startswith('linux'):
            listing = subprocess.check_output(['ip', '-4', '-o', 'addr', 'show', 'up'], text=True, timeout=2)
            for line in listing.splitlines():
                match = re.search(r'\d+: (\S+)\s+inet (\d+\.\d+\.\d+\.\d+)', line)
                if match and match[1].startswith(('en', 'eth', 'wl')):
                    return match[2]
    except (OSError, subprocess.SubprocessError):
        pass
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as probe:
            probe.connect(('192.0.2.1', 80))
            return probe.getsockname()[0]
    except OSError:
        return '127.0.0.1'


def prune_sessions():
    for key, session in list(SESSIONS.items()):
        if session['expires'] <= time.monotonic():
            del SESSIONS[key]


def qr_svg(value):
    qr = QrCode.encode_text(value, QrCode.Ecc.MEDIUM)
    size = qr.get_size()
    path = ' '.join(f'M{x+4},{y+4}h1v1h-1z' for y in range(size)
                    for x in range(size) if qr.get_module(x, y))
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {size+8} {size+8}" '
            f'shape-rendering="crispEdges"><rect width="100%" height="100%" fill="white"/>'
            f'<path d="{path}" fill="#162b20"/></svg>').encode()


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('Referrer-Policy', 'no-referrer')
        super().end_headers()

    def log_message(self, fmt, *args):
        # Handoff capability tokens must not appear in the server log.
        if not self.path.startswith('/api/'):
            super().log_message(fmt, *args)

    def respond(self, status, data, content_type='application/json; charset=utf-8'):
        body = json.dumps(data, ensure_ascii=False).encode() if isinstance(data, dict) else data
        self.send_response(status)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def same_origin(self):
        origin = self.headers.get('Origin')
        return not origin or origin == 'http://' + self.headers.get('Host', '')

    def read_json(self):
        try:
            length = int(self.headers.get('Content-Length', '0'))
            if not 0 < length <= MAX_BODY:
                raise ValueError
            return json.loads(self.rfile.read(length))
        except (ValueError, UnicodeError):
            return None

    def session_from_url(self):
        url = urlsplit(self.path)
        parts = url.path.strip('/').split('/')
        if len(parts) not in (3, 4) or parts[:2] != ['api', 'photo-sessions']:
            return None, None
        session = SESSIONS.get(parts[2])
        key = parse_qs(url.query).get('key', [''])[0]
        if not session or not key.isascii() or not secrets.compare_digest(session['read_key'], key):
            return None, None
        return parts[2], session

    def do_GET(self):
        path = urlsplit(self.path).path
        if path.startswith('/api/'):
            with LOCK:
                prune_sessions()
                _, session = self.session_from_url()
                if not session:
                    return self.respond(404, {'error': 'Код истёк. Создай новый QR на компьютере.'})
                if path.endswith('/qr'):
                    return self.respond(200, qr_svg(session['upload_url']), 'image/svg+xml')
                return self.respond(200, {'image': session.get('image')})
        if path not in ('/', '/index.html', '/app.js', '/app.css', '/photo.js',
                        '/upload.html', '/upload.js', '/upload.css', '/favicon.ico'):
            asset = ROOT / path.lstrip('/')
            if not path.startswith('/assets/') or not asset.resolve().is_relative_to(ROOT / 'assets'):
                return self.send_error(404)
        super().do_GET()

    def do_POST(self):
        if not self.same_origin():
            return self.respond(403, {'error': 'Открой страницу с адреса мастерской.'})
        path = urlsplit(self.path).path
        if path == '/api/photo-sessions':
            with LOCK:
                prune_sessions()
                if len(SESSIONS) >= 100:
                    return self.respond(429, {'error': 'Слишком много QR-кодов. Подожди немного.'})
                session_id, read_key, upload_key = (secrets.token_urlsafe(24) for _ in range(3))
                host = urlsplit('http://' + self.headers.get('Host', '')).hostname
                public_url = self.server.public_url
                try:
                    if host and not ipaddress.ip_address(host).is_loopback:
                        public_url = 'http://' + self.headers['Host']
                except ValueError:
                    pass
                upload_url = public_url + '/upload.html#token=' + upload_key
                session = {'read_key': read_key, 'upload_key': upload_key,
                           'expires': time.monotonic() + TTL, 'upload_url': upload_url}
                SESSIONS[session_id] = session
                poll_url = f'/api/photo-sessions/{session_id}?key={read_key}'
                return self.respond(201, {'upload_url': upload_url, 'poll_url': poll_url,
                    'qr_url': f'/api/photo-sessions/{session_id}/qr?key={read_key}', 'expires_in': TTL})
        if path == '/api/photo-upload':
            data = self.read_json()
            if not isinstance(data, dict) or not isinstance(data.get('token'), str) or not data['token'].isascii():
                return self.respond(400, {'error': 'Неверные данные. Выбери картинку заново.'})
            image = data.get('image')
            if not isinstance(image, str) or not image.startswith('data:image/jpeg;base64,') or len(image) > 220000:
                return self.respond(400, {'error': 'Нужна подготовленная JPG-картинка до 165 КБ.'})
            try:
                decoded = base64.b64decode(image.split(',', 1)[1], validate=True)
                if not decoded.startswith(b'\xff\xd8\xff') or not decoded.endswith(b'\xff\xd9'):
                    raise ValueError
            except (ValueError, binascii.Error):
                return self.respond(400, {'error': 'Картинка повреждена. Выбери другой файл.'})
            with LOCK:
                prune_sessions()
                session = next((s for s in SESSIONS.values()
                    if secrets.compare_digest(s['upload_key'], data['token'])), None)
                if not session:
                    return self.respond(410, {'error': 'QR-код истёк или закрыт. Открой новый на компьютере.'})
                if session.get('image'):
                    if session['image'] == image:
                        return self.respond(200, {'ok': True})
                    return self.respond(409, {'error': 'Фото уже отправлено. Для другого фото создай новый QR.'})
                session['image'] = image
                return self.respond(200, {'ok': True})
        self.respond(404, {'error': 'Адрес не найден.'})

    def do_DELETE(self):
        if not self.same_origin():
            return self.respond(403, {'error': 'Неверный адрес.'})
        with LOCK:
            prune_sessions()
            session_id, session = self.session_from_url()
            if not session:
                return self.respond(404, {'error': 'Код уже закрыт.'})
            del SESSIONS[session_id]
            self.respond(200, {'ok': True})


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--port', type=int, default=4173)
    parser.add_argument('--bind', default='0.0.0.0')
    parser.add_argument('--public-url', help='LAN address reachable from phones, e.g. http://192.168.1.10:4173')
    args = parser.parse_args()
    server = ThreadingHTTPServer((args.bind, args.port), Handler)
    server.public_url = (args.public_url or f'http://{lan_address()}:{args.port}').rstrip('/')
    print(f'Local: http://127.0.0.1:{args.port}/', flush=True)
    print(f'Phone / classroom: {server.public_url}/', flush=True)
    try:
        server.serve_forever(poll_interval=0.5)
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
