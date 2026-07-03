from __future__ import annotations

import json
import os
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from flask import Flask, jsonify, render_template


GITHUB_USER = "AndreiPabiarzhyn"
CACHE_FILE = Path("/tmp/portfolio_github_cache.json")
CACHE_TTL = 60 * 30

FALLBACK_PROJECTS = [
    {
        "name": "roblox-game-m4l1-aura",
        "description": "Игровой проект с интерактивными механиками и атмосферной подачей.",
        "html_url": "https://github.com/AndreiPabiarzhyn/roblox-game-m4l1-aura",
        "homepage": "",
        "language": "Lua",
        "topics": ["roblox", "game-dev"],
        "stargazers_count": 0,
        "forks_count": 0,
        "pushed_at": "",
    },
    {
        "name": "clone-piskel-gif-anim",
        "description": "Редактор пиксельной графики и GIF-анимаций в браузере.",
        "html_url": "https://github.com/AndreiPabiarzhyn/clone-piskel-gif-anim",
        "homepage": "",
        "language": "JavaScript",
        "topics": ["canvas", "animation"],
        "stargazers_count": 0,
        "forks_count": 0,
        "pushed_at": "",
    },
]


def create_app() -> Flask:
    app = Flask(__name__)

    @app.get("/")
    def index():
        return render_template("index.html", github_user=GITHUB_USER)

    @app.get("/api/projects")
    def projects():
        return jsonify(get_projects())

    @app.get("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app


def get_projects() -> list[dict]:
    cached = read_cache()
    if cached is not None:
        return cached

    request = Request(
        f"https://api.github.com/users/{GITHUB_USER}/repos"
        "?type=owner&sort=pushed&direction=desc&per_page=100",
        headers={
            "Accept": "application/vnd.github+json",
            "User-Agent": "Andrei-Portfolio",
            "X-GitHub-Api-Version": "2022-11-28",
        },
    )

    try:
        with urlopen(request, timeout=6) as response:
            repositories = json.load(response)
        projects = [
            normalize_project(repository)
            for repository in repositories
            if not repository.get("fork") and not repository.get("archived")
        ]
        projects.sort(
            key=lambda item: (
                item["name"] not in {"clone-piskel-gif-anim", "roblox-game-m4l1-aura"},
                item["pushed_at"],
            )
        )
        write_cache(projects)
        return projects
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, OSError):
        return FALLBACK_PROJECTS


def normalize_project(repository: dict) -> dict:
    return {
        "name": repository.get("name", "Untitled"),
        "description": repository.get("description") or "Проект в разработке — детали на GitHub.",
        "html_url": repository.get("html_url", ""),
        "homepage": repository.get("homepage") or "",
        "language": repository.get("language") or "Other",
        "topics": repository.get("topics") or [],
        "stargazers_count": repository.get("stargazers_count", 0),
        "forks_count": repository.get("forks_count", 0),
        "pushed_at": repository.get("pushed_at", ""),
    }


def read_cache() -> list[dict] | None:
    try:
        data = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        if time.time() - data["created_at"] < CACHE_TTL:
            return data["projects"]
    except (OSError, KeyError, TypeError, json.JSONDecodeError):
        return None
    return None


def write_cache(projects: list[dict]) -> None:
    try:
        CACHE_FILE.write_text(
            json.dumps({"created_at": time.time(), "projects": projects}),
            encoding="utf-8",
        )
    except OSError:
        pass


app = create_app()


if __name__ == "__main__":
    app.run(debug=os.getenv("FLASK_DEBUG", "0") == "1")
