# Portfolio — Flask + Three.js

Интерактивное портфолио Андрея Побяржина с автоматической галереей публичных GitHub-проектов.

## Локальный запуск

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
flask --app app run --debug
```

Откройте `http://127.0.0.1:5000`.

## Vercel

1. Загрузите проект в GitHub.
2. Импортируйте репозиторий в Vercel.
3. Нажмите Deploy — Flask и `vercel.json` будут определены автоматически.

API `/api/projects` получает публичные репозитории GitHub и кеширует ответ на 30 минут.
