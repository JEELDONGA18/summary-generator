# app/routes/upload.py

from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename
from datetime import datetime

from app.models import FileUpload
from app import db  # This is your SQLAlchemy instance

UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../uploads'))
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

upload_bp = Blueprint('upload', __name__)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    user_id = request.form.get('user_id')  # Expecting this from the frontend

    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400

    if not file or file.filename.strip() == '':
        return jsonify({'error': 'No selected file'}), 400

    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filetype = filename.rsplit('.', 1)[1].lower()
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)

        # ✅ Insert into uploaded_files using SQLAlchemy model
        uploaded_file = FileUpload(
            filename=filename,
            filepath=filepath,
            file_type=filetype,
            uploaded_at=datetime.utcnow(),
            user_id=int(user_id)
        )

        db.session.add(uploaded_file)
        db.session.commit()

        return jsonify({
            'message': f'File {filename} uploaded and logged successfully!',
            'path': filepath
        }), 200

    return jsonify({'error': 'Invalid file type. Allowed: pdf, docx, txt'}), 400