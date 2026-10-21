# QR на school.tube-city.ru

Статический nginx отдаёт редактор, но не выполняет Python. Ответ 404 на `POST /api/photo-sessions` означает, что маршрут сервиса не подключён. Нужны постоянно работающий `server.py` и проксирование `/api/` в него. Одна замена HTML/JS это не исправляет.

## Установка на Ubuntu/Debian с nginx и systemd

Из корня актуального checkout репозитория (там находится папка `web-lab`):

```sh
sudo install -d -m 755 /opt/school-photo
sudo cp -R web-lab/. /opt/school-photo/
sudo chmod -R a+rX /opt/school-photo
sudo install -m 644 web-lab/deploy/school-photo.service /etc/systemd/system/school-photo.service
sudo systemctl daemon-reload
sudo systemctl enable --now school-photo
sudo systemctl restart school-photo
sudo install -m 644 web-lab/deploy/school-photo.nginx.conf /etc/nginx/snippets/school-photo.conf
```

Сервис использует Python 3.9+, без сторонних пакетов. Работает от `www-data` на `127.0.0.1:4174`; открывать этот порт в интернет не нужно. В unit задан публичный HTTPS-адрес: его сервер использует для проверки Origin и ссылки в QR.

В **существующий `server { … }` для HTTPS-домена `school.tube-city.ru`** добавьте:

```nginx
include /etc/nginx/snippets/school-photo.conf;
```

Если в этом блоке уже есть `location /api/`, замените его содержимым из `school-photo.nginx.conf` вместо добавления второго. Настройки TLS и статического корня сайта сохраняются. По статическому корню должны быть доступны актуальные `upload.html`, `upload.js`, `upload.css`, `photo.js` и остальные файлы редактора из `web-lab`.

Проверьте конфигурацию и только затем перезагрузите nginx:

```sh
sudo nginx -t && sudo systemctl reload nginx
```

## Проверка

```sh
curl -i -X POST -H 'Origin: https://school.tube-city.ru' https://school.tube-city.ru/api/photo-sessions
```

Ожидается **201**, JSON с `upload_url`, `poll_url`, `qr_url`; `upload_url` начинается с `https://school.tube-city.ru/upload.html#token=`. Ссылки содержат временные ключи: не публикуйте их. Проверочный сеанс истечёт через 10 минут.

Обновите редактор в браузере и отправьте фото с телефона по новому QR. Для опубликованного HTTPS-сайта общая Wi-Fi-сеть не требуется: обоим устройствам нужен доступ к домену.

Если ответ 502, проверьте сервис:

```sh
sudo systemctl status school-photo --no-pager
sudo journalctl -u school-photo -n 30 --no-pager
```

Если ответ 404, проверьте, что include добавлен в активный HTTPS-блок нужного домена и nginx перезагружен. Если 403, проверьте `--public-url` в unit и `Origin`: оба должны указывать на `https://school.tube-city.ru`.

## Обновления

После получения новых файлов повторите копирование и перезапустите сервис:

```sh
sudo cp -R web-lab/. /opt/school-photo/
sudo chmod -R a+rX /opt/school-photo
sudo systemctl restart school-photo
```

Перезапуск удаляет временные QR-сеансы из памяти. Создайте новые QR; сохранённые проекты в браузерах сохранятся. Один процесс сервиса обслуживает все сеансы. Несколько независимых процессов потребуют общего хранилища сеансов.
