import logging
import requests
from datetime import datetime
from bs4 import BeautifulSoup
from gunicorn.app.base import BaseApplication
from app_init import app
from database import db, run_migrations
from shared import fetch_daily_text


# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class StandaloneApplication(BaseApplication):
    def __init__(self, app, options=None):
        self.application = app
        self.options = options or {}
        super().__init__()

    def load_config(self):
        # Apply configuration to Gunicorn
        for key, value in self.options.items():
            if key in self.cfg.settings and value is not None:
                self.cfg.set(key.lower(), value)

    def load(self):
        return self.application

if __name__ == "__main__":
    # Initialize the app
    with app.app_context():
        db.init_app(app)
        run_migrations(app)
    
    from routes import register_routes
    register_routes(app)

    options = {
        "bind": "0.0.0.0:8080",
        "workers": 4,
        "loglevel": "info",
        "accesslog": "-",
        "timeout": 120,
        "preload_app": True  # Enable preloading of the application
    }
    StandaloneApplication(app, options).run()