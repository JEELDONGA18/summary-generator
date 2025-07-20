from flask import Blueprint
from .chat import chat_bp
from .upload import upload_bp

def register_routes(app):
    app.register_blueprint(chat_bp)
    app.register_blueprint(upload_bp)