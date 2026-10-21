# Деплой в Dokploy

Редактор, страница загрузки с телефона и QR API запускаются **одним контейнером** из Dockerfile в корне репозитория. Настройка nginx, systemd и SSH не требуется. Домен и HTTPS обслуживает Dokploy.

## Один раз в приложении Dokploy

В General / настройках сборки:

| Поле | Значение |
| --- | --- |
| Branch | `codex/web-workshop` |
| Build Path | `/` (корень репозитория) |
| Build Type | `Dockerfile` |
| Dockerfile Path | `Dockerfile` |
| Docker Context Path (если есть) | `.` |

В Domains у существующего `school.tube-city.ru`: **Container Port `80`**, Path `/`, HTTPS включён. Это тот же порт, который использует Static. Отдельный домен или маршрут для `/api/` не нужен.

Сохраните настройки и нажмите **Deploy**. Тип Static или Nixpacks с Publish Directory не запускает QR API: для этой сборки нужен именно Dockerfile.

В Dockerfile уже заданы `PORT=80` и `WORKSHOP_PUBLIC_URL=https://school.tube-city.ru`. Добавлять переменные в панели для этого домена не нужно. Если Environment в Dokploy уже содержит `PORT` или `WORKSHOP_PUBLIC_URL`, удалите старые значения либо задайте указанные выше: переменные панели имеют приоритет над значениями образа.

Используйте одну реплику приложения: временные QR-сеансы хранятся в памяти одного процесса. Перезапуск или новый деплой завершает открытые QR-сеансы; создайте новые QR. Сохранённые проекты остаются в браузере.

## Проверка после деплоя

Откройте `https://school.tube-city.ru/api/health`. Ожидается:

```json
{"ok": true, "service": "school-workshop"}
```

Затем обновите редактор и отправьте фото по новому QR. Нужен доступ к домену с обоих устройств; общая Wi-Fi-сеть не требуется.

- Если `/api/health` возвращает 404 или HTML, домен ещё ведёт на статическую сборку. Проверьте Build Type, выбранную ветку и успешное завершение последнего Deploy.
- Если 502, проверьте Logs приложения, Container Port `80` и отсутствие другого значения `PORT` в Environment.
- Проверка готовности `/api/health` встроена в Dockerfile. Временные ссылки и ключи QR в логи API не записываются.

## Другой домен

В Environment задайте `WORKSHOP_PUBLIC_URL=https://ваш-домен`, сохраните и сделайте Deploy. Сервер использует этот адрес для ссылок в QR и проверки Origin за HTTPS-прокси. При необходимости другой порт задаётся переменной `PORT`; Container Port в Domains должен совпадать с ней.

## Локальная проверка контейнера

Из корня репозитория:

```sh
docker build -t school-workshop .
docker run --rm -p 4173:80 -e WORKSHOP_PUBLIC_URL=http://192.168.1.10:4173 school-workshop
```

Замените `192.168.1.10` сетевым адресом своего компьютера. Откройте редактор на `http://127.0.0.1:4173/`, телефон подключите к той же сети.

Ручной вариант для администратора отдельного сервера сохранён в [manual-nginx.md](manual-nginx.md); для Dokploy он не нужен.

Документация Dokploy: [Dockerfile build](https://docs.dokploy.com/docs/core/applications/build-type), [Domains и Container Port](https://docs.dokploy.com/docs/core/domains).
