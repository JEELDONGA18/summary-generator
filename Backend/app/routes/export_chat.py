from flask import Blueprint, request, send_file, jsonify
from fpdf import FPDF
from datetime import datetime
import os
from app.models import User, ExportedChat
from app import db

export_bp = Blueprint('export', __name__)

@export_bp.route('/export-chat', methods=['POST'])
def export_chat():
    try:
        data = request.get_json()
        email = data.get("email")
        if not email:
            return jsonify({"error": "Missing user email"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        user_id = user.id

        # Locate session.txt
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
        chat_file = os.path.join(base_dir, "chat", f"user_{user_id}", "session.txt")
        if not os.path.exists(chat_file):
            return jsonify({"error": "No chat found"}), 404

        with open(chat_file, "r", encoding="utf-8") as f:
            chat_content = f.read()

        # Output path: ~/Downloads/SmartDocAI/
        downloads_path = os.path.join(os.path.expanduser("~"), "Downloads", "SmartDocAI")
        os.makedirs(downloads_path, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_name = f"chat_{timestamp}.pdf"
        export_path = os.path.join(downloads_path, file_name)

        # Font paths
        font_regular = os.path.join(base_dir, "fonts", "DejaVuSans.ttf")
        font_bold = os.path.join(base_dir, "fonts", "DejaVuSans-Bold.ttf")

        if not os.path.exists(font_regular) or not os.path.exists(font_bold):
            return jsonify({"error": "Required font files not found (DejaVuSans or DejaVuSans-Bold)"}), 500

        # PDF setup
        pdf = FPDF()
        pdf.add_page()
        pdf.set_auto_page_break(auto=True, margin=15)

        pdf.add_font("DejaVu", "", font_regular, uni=True)
        pdf.add_font("DejaVu", "B", font_bold, uni=True)

        pdf.set_font("DejaVu", "", 12)

        # Process and format lines
        for line in chat_content.strip().split("\n"):
            line = line.strip()
            if line.startswith("Q:"):
                pdf.set_font("DejaVu", "B", 12)
                pdf.multi_cell(0, 10, line)
                pdf.set_font("DejaVu", "", 12)
                pdf.ln(2)
            elif line.startswith("A:"):
                # Bold A: only
                pdf.set_font("DejaVu", "B", 12)
                pdf.cell(10, 10, "A:", ln=0)
                # Regular answer
                answer_text = line[2:].strip()
                pdf.set_font("DejaVu", "", 12)
                pdf.multi_cell(0, 10, f" {answer_text}")
                pdf.ln(2)
            else:
                pdf.set_font("DejaVu", "", 12)
                pdf.multi_cell(0, 10, line)
                pdf.ln(1)

        pdf.output(export_path)

        # DB save
        record = ExportedChat(
            user_id=user_id,
            file_name=file_name,
            file_format="pdf",
            file_path=export_path
        )
        db.session.add(record)
        db.session.commit()

        return send_file(export_path, as_attachment=True, download_name=file_name)

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
    
    