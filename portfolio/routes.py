from flask import Blueprint, Response, jsonify, render_template, url_for

from .content import GITHUB_USER
from .github import get_featured_projects


main = Blueprint("main", __name__)


@main.after_app_request
def prevent_stale_html(response):
    if response.mimetype == "text/html":
        response.headers["Cache-Control"] = "no-store, max-age=0"
        response.headers["Pragma"] = "no-cache"
    return response


@main.get("/")
def index():
    return render_template("index.html", github_user=GITHUB_USER)


@main.get("/api/projects")
def projects():
    return jsonify(get_featured_projects())


@main.get("/api/health")
def health():
    return jsonify({"status": "ok"})


@main.get("/robots.txt")
def robots():
    sitemap_url = url_for("main.sitemap", _external=True)
    return Response(
        f"User-agent: *\nAllow: /\nSitemap: {sitemap_url}\n",
        mimetype="text/plain",
    )


@main.get("/sitemap.xml")
def sitemap():
    home_url = url_for("main.index", _external=True)
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f"<url><loc>{home_url}</loc><changefreq>weekly</changefreq>"
        "<priority>1.0</priority></url></urlset>"
    )
    return Response(xml, mimetype="application/xml")
