import logging
from flask import render_template
from app_init import app
from shared import fetch_daily_text

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_routes(app):
    @app.route("/")
    def home_route():
        daily_text = fetch_daily_text()
        return render_template("home.html", daily_text=daily_text)