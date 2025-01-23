
from flask import Flask, g
from flask_pymongo import PyMongo
from dotenv import load_dotenv
import os
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from werkzeug.wrappers import Response

from .routes.home import home_bp
from .routes.auth import auth_bp
from .routes.game import game_bp
from .routes.map import map_bp

mongo = PyMongo()

def create_app():
    load_dotenv()
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")

    # MongoDB configuration
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    mongo.init_app(app)

    @app.before_request
    def before_request():
        g.mongo = mongo

    # Wrap Flask app with the "/home" prefix
    app.wsgi_app = DispatcherMiddleware(
        Response("Not Found", status=404),  # Fallback for unmatched routes
        {"/home": app.wsgi_app}  # Mount app at "/home"
    )

    # Register blueprints as usual
    app.register_blueprint(home_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(game_bp)
    app.register_blueprint(map_bp)

    return app
