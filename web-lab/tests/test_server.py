"""Exercise the actual handoff HTTP protocol with isolated in-memory sessions."""
import base64
from concurrent.futures import ThreadPoolExecutor
import json
from pathlib import Path
import sys
import threading
import time
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen
from urllib.parse import parse_qs, urlsplit

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
import server


class PhotoHandoffTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.http = server.ThreadingHTTPServer(('127.0.0.1', 0), server.Handler)
        cls.base = 'http://127.0.0.1:' + str(cls.http.server_port)
        cls.http.public_url = cls.base
        cls.thread = threading.Thread(target=cls.http.serve_forever, daemon=True)
        cls.thread.start()
        cls.photo = 'data:image/jpeg;base64,' + base64.b64encode(
            (Path(server.ROOT) / 'assets/sport.jpg').read_bytes()).decode()
        assert len(cls.photo) <= 220000, 'Use a workshop JPEG within the handoff size limit.'

    @classmethod
    def tearDownClass(cls):
        cls.http.shutdown()
        cls.http.server_close()
        cls.thread.join()

    def setUp(self):
        with server.LOCK:
            server.SESSIONS.clear()

    def request(self, path, method='GET', data=None, headers=None):
        body = json.dumps(data).encode() if data is not None else None
        request = Request(self.base + path, data=body, method=method, headers=headers or {})
        try:
            response = urlopen(request, timeout=3)
        except HTTPError as error:
            response = error
        content = response.read()
        if 'application/json' in response.headers.get('Content-Type', ''):
            content = json.loads(content)
        return response.status, content

    def create(self):
        status, session = self.request('/api/photo-sessions', 'POST')
        self.assertEqual(status, 201)
        token = session['upload_url'].split('#token=')[1]
        return session, token

    def test_round_trip_and_reader_isolation(self):
        first, token = self.create()
        second, _ = self.create()
        self.assertEqual(self.request(first['poll_url'])[1], {'image': None})
        status, svg = self.request(first['qr_url'])
        self.assertEqual(status, 200)
        self.assertIn(b'<svg', svg)
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': self.photo})[0], 200)
        self.assertEqual(self.request(first['poll_url'])[1]['image'], self.photo)
        self.assertIsNone(self.request(second['poll_url'])[1]['image'])
        self.assertEqual(self.request(first['poll_url'].split('?')[0] + '?key=wrong')[0], 404)
        self.assertEqual(self.request(first['poll_url'].split('?')[0] + '?key=' + token)[0], 404)

    def test_delete_revokes_phone_link(self):
        session, token = self.create()
        self.assertEqual(self.request(session['poll_url'], 'DELETE')[0], 200)
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': self.photo})[0], 410)

    def test_expired_session(self):
        session, token = self.create()
        with server.LOCK:
            next(iter(server.SESSIONS.values()))['expires'] = time.monotonic() - 1
        self.assertEqual(self.request(session['poll_url'])[0], 404)
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': self.photo})[0], 410)

    def test_bad_image_and_cross_origin_rejected(self):
        _, token = self.create()
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': 'not a photo'})[0], 400)
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': self.photo}, {'Origin':'https://other.example'})[0], 403)
        self.assertEqual(self.request('/api/photo-sessions', 'POST', headers={'Origin':'https://other.example'})[0], 403)
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': 'x' * 226000})[0], 400)

    def test_retries_are_idempotent(self):
        _, token = self.create()
        data = {'token': token, 'image': self.photo}
        self.assertEqual(self.request('/api/photo-upload', 'POST', data)[0], 200)
        self.assertEqual(self.request('/api/photo-upload', 'POST', data)[0], 200)

    def test_classroom_parallel_uploads_stay_in_their_own_sessions(self):
        # A distinct, valid JPEG per pupil: insert a JPEG comment after SOI.
        jpeg = (Path(server.ROOT) / 'assets/sport.jpg').read_bytes()

        def create_pupil(index):
            session, token = self.create()
            comment = ('pupil-' + str(index)).encode()
            photo = jpeg[:2] + b'\xff\xfe' + (len(comment) + 2).to_bytes(2, 'big') + comment + jpeg[2:]
            image = 'data:image/jpeg;base64,' + base64.b64encode(photo).decode()
            return session, token, image

        with ThreadPoolExecutor(max_workers=6) as pool:
            pupils = list(pool.map(create_pupil, range(30)))

        self.assertEqual(len({s['upload_url'] for s, _, _ in pupils}), 30)
        self.assertEqual(len({s['poll_url'] for s, _, _ in pupils}), 30)
        self.assertEqual(len({s['qr_url'] for s, _, _ in pupils}), 30)
        all_keys = [key for session, token, _ in pupils for key in (
            token,
            parse_qs(urlsplit(session['poll_url']).query)['key'][0],
            urlsplit(session['poll_url']).path.split('/')[-1],
        )]
        self.assertEqual(len(set(all_keys)), 90, 'session IDs, read keys and upload tokens are independent')

        def upload(pupil):
            _, token, image = pupil
            return self.request('/api/photo-upload', 'POST', {'token': token, 'image': image})[0]

        with ThreadPoolExecutor(max_workers=6) as pool:
            self.assertEqual(list(pool.map(upload, reversed(pupils))), [200] * 30)

        def read(pupil):
            session, _, image = pupil
            status, data = self.request(session['poll_url'])
            return status == 200 and data['image'] == image

        with ThreadPoolExecutor(max_workers=6) as pool:
            self.assertTrue(all(pool.map(read, pupils)), 'each pupil sees exactly their own JPEG')

    def test_other_sessions_read_key_cannot_read_qr_or_delete_session(self):
        first, _ = self.create()
        second, _ = self.create()
        first_status, first_qr = self.request(first['qr_url'])
        second_status, second_qr = self.request(second['qr_url'])
        self.assertEqual((first_status, second_status), (200, 200))
        self.assertNotEqual(first_qr, second_qr, 'rendered QR codes differ as well as their URLs')
        foreign_key = parse_qs(urlsplit(second['poll_url']).query)['key'][0]
        first_path = urlsplit(first['poll_url']).path
        self.assertEqual(self.request(first_path + '?key=' + foreign_key)[0], 404)
        self.assertEqual(self.request(first_path + '/qr?key=' + foreign_key)[0], 404)
        self.assertEqual(self.request(first_path + '?key=' + foreign_key, 'DELETE')[0], 404)
        self.assertEqual(self.request(first['poll_url'])[0], 200, 'foreign delete did not remove the session')
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': foreign_key, 'image': self.photo})[0], 410)
        self.assertIsNone(self.request(first['poll_url'])[1]['image'])
        self.assertIsNone(self.request(second['poll_url'])[1]['image'])

    def test_closed_qr_never_redirects_to_a_new_session(self):
        old, old_token = self.create()
        self.assertEqual(self.request(old['poll_url'], 'DELETE')[0], 200)
        new, new_token = self.create()
        self.assertNotEqual(old_token, new_token)
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': old_token, 'image': self.photo})[0], 410)
        self.assertEqual(self.request(old['poll_url'])[0], 404)
        self.assertIsNone(self.request(new['poll_url'])[1]['image'])

    def test_accepted_photo_cannot_be_replaced_by_another_photo(self):
        session, token = self.create()
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': self.photo})[0], 200)
        other = 'data:image/jpeg;base64,' + base64.b64encode(
            (Path(server.ROOT) / 'assets/music.jpg').read_bytes()).decode()
        self.assertEqual(self.request('/api/photo-upload', 'POST', {'token': token, 'image': other})[0], 409)
        self.assertEqual(self.request(session['poll_url'])[1]['image'], self.photo)

    def test_only_workshop_assets_are_served(self):
        self.assertEqual(self.request('/')[0], 200)
        self.assertEqual(self.request('/upload.html')[0], 200)
        self.assertEqual(self.request('/lesson.js')[0], 200)
        for path in ['/server.py', '/vendor/qrcodegen.py', '/assets/../server.py', '/../README.md']:
            self.assertEqual(self.request(path)[0], 404)


if __name__ == '__main__':
    unittest.main()
