# routes/chat.py
from flask import Blueprint, request, jsonify
from app.services.ai_response import get_ai_response, build_prompt
from app.services.document_reader import extract_text_unstructured

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

        # Extract text from the document using Unstructured
        doc_text = extract_text_unstructured(filepath)
        if doc_text.startswith("Error"):
            return jsonify({"error": doc_text}), 500

        # Prepare prompt and get AI response
        prompt = build_prompt(question, doc_text)
        answer = get_ai_response(prompt)

        return jsonify({"answer": answer}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500