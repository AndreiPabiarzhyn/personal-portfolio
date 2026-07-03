# Portfolio — Flask + Three.js

Интерактивное портфолио Андрея Побяржина: авторские кейсы, локальные обложки проектов, мультиязычность и Three.js-сцена.

## Архитектура

```text
app.py                  # точка входа Flask / Vercel
portfolio/
  __init__.py           # application factory
  routes.py             # страницы, API, sitemap и robots.txt
  github.py             # GitHub API, нормализация и кеш
  content.py            # выбранные проекты и тексты кейсов
templates/
  index.html            # семантическая разметка
static/
  css/style.css         # дизайн и адаптивность
  js/app.js             # i18n, карточки, анимации и Three.js
  images/               # локальные оптимизированные медиа
```

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

API `/api/projects` объединяет актуальные данные GitHub с авторскими кейсами из `portfolio/content.py` и кеширует GitHub-ответ на 30 минут.
