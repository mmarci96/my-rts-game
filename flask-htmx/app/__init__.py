from flask import Flask, g
from .routes.home import home_bp
from .routes.auth import auth_bp
from .routes.game import game_bp
from .routes.map import map_bp
from flask_pymongo import PyMongo
import os

mongo = PyMongo()

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv("SECRET_KEY", "default_secret_key")

    # MongoDB configuration
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/mydatabase")
    mongo.init_app(app)

    @app.before_request
    def before_request():
        g.mongo = mongo

    # Register blueprints
    app.register_blueprint(home_bp, url_prefix='/home')
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(game_bp, url_prefix='/game')
    app.register_blueprint(map_bp, url_prefix='/map')

    return app
