FROM python:3.12-slim-bookworm

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=80 \
    WORKSHOP_PUBLIC_URL=https://school.tube-city.ru

WORKDIR /app
COPY web-lab/ ./

EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD ["python3", "-c", "import json,os,urllib.request; r=urllib.request.urlopen('http://127.0.0.1:'+os.environ.get('PORT','80')+'/api/health',timeout=2); assert json.load(r)=={'ok':True,'service':'school-workshop'}"]

CMD ["python3", "-B", "server.py"]
