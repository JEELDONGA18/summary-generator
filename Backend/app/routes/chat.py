# routes/chat.py
from flask import Blueprint, request, jsonify
from app.services.ai_response import get_ai_response, build_prompt
from app.services.document_reader import extract_text_unstructured
from app.models import FileUpload
import os

chat_bp = Blueprint('chat', __name__)

@chat_bp.route('/chat', methods=['POST'])
def chat():
    try:
        data = request.get_json()
        question = data.get("question")
        filepath = data.get("filepath")

        if not question:
            return jsonify({"error": "No question provided"}), 400
        if not filepath:
            return jsonify({"error": "No filepath provided"}), 400

        # Extract text from the uploaded document
        doc_text = extract_text_unstructured(filepath)
        if doc_text.startswith("Error"):
            return jsonify({"error": doc_text}), 500

        # Get AI response
        prompt = build_prompt(question, doc_text)
        answer = get_ai_response(prompt)

        # Save chat to file
        file = FileUpload.query.filter_by(filepath=filepath).first()
        user_id = file.user_id if file else None

        if user_id:
            base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
            chat_dir = os.path.join(base_dir, "chat", f"user_{user_id}")
            os.makedirs(chat_dir, exist_ok=True)

            session_path = os.path.join(chat_dir, "session.txt")
            print(f"[Chat] Saving to: {session_path}")
            with open(session_path, "a", encoding="utf-8") as f:
                f.write(f"Q: {question}\nA: {answer}\n\n")

        return jsonify({"answer": answer}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500