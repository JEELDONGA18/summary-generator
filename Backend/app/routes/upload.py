# app.routs.upload.py
from flask import Blueprint, request, jsonify
import os
from werkzeug.utils import secure_filename

# Correct upload folder path (2 levels up from this file to reach /uploads)
UPLOAD_FOLDER = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../uploads'))

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'txt'}

# Create Blueprint
upload_bp = Blueprint('upload', __name__)

# Check allowed file type
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Route to upload file
@upload_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']
    
    if not file or file.filename.strip() == '':
        return jsonify({'error': 'No selected file'}), 400

    if allowed_file(file.filename):
        filename = secure_filename(file.filename)
        os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Ensure upload directory exists
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        file.save(filepath)
        return jsonify({
            'message': f'File {filename} uploaded successfully!',
            'path': filepath
        }), 200

    return jsonify({'error': 'Invalid file type. Allowed: pdf, docx, txt'}), 400