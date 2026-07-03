from __future__ import annotations

import json
import time
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from .content import FEATURED_PROJECTS, GITHUB_USER


CACHE_FILE = Path("/tmp/portfolio_github_cache.json")
CACHE_TTL = 60 * 30


def get_featured_projects() -> list[dict]:
    repositories = _get_repositories()
    by_name = {repository["name"]: repository for repository in repositories}
    projects = []

    for name, editorial in FEATURED_PROJECTS.items():
        repository = by_name.get(name, _fallback_repository(name))
        projects.append({**repository, **editorial})

    return sorted(projects, key=lambda project: project["order"])


def _get_repositories() -> list[dict]:
    cached = _read_cache()
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
            raw_repositories = json.load(response)
        repositories = [
            _normalize(repository)
            for repository in raw_repositories
            if not repository.get("fork") and not repository.get("archived")
        ]
        _write_cache(repositories)
        return repositories
    except (HTTPError, URLError, TimeoutError, json.JSONDecodeError, OSError):
        return []


def _normalize(repository: dict) -> dict:
    return {
        "name": repository.get("name", "Untitled"),
        "description": repository.get("description") or "",
        "html_url": repository.get("html_url", ""),
        "homepage": repository.get("homepage") or "",
        "language": repository.get("language") or "Other",
        "topics": repository.get("topics") or [],
        "stargazers_count": repository.get("stargazers_count", 0),
        "forks_count": repository.get("forks_count", 0),
        "pushed_at": repository.get("pushed_at", ""),
    }


def _fallback_repository(name: str) -> dict:
    return {
        "name": name,
        "description": "",
        "html_url": f"https://github.com/{GITHUB_USER}/{name}",
        "homepage": "",
        "language": "Other",
        "topics": [],
        "stargazers_count": 0,
        "forks_count": 0,
        "pushed_at": "",
    }


def _read_cache() -> list[dict] | None:
    try:
        data = json.loads(CACHE_FILE.read_text(encoding="utf-8"))
        if time.time() - data["created_at"] < CACHE_TTL:
            return data["projects"]
    except (OSError, KeyError, TypeError, json.JSONDecodeError):
        return None
    return None


def _write_cache(projects: list[dict]) -> None:
    try:
        CACHE_FILE.write_text(
            json.dumps({"created_at": time.time(), "projects": projects}),
            encoding="utf-8",
        )
    except OSError:
        pass
