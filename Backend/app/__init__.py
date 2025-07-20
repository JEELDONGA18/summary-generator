from flask import Flask
from flask_cors import CORS
from app.routes.upload import upload_bp
from app.routes.chat import chat_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(upload_bp)
    app.register_blueprint(chat_bp)
    return app