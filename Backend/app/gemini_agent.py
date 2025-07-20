# app/gemini_agent.py
from services.document_reader import extract_text_from_file, clean_text
from services.ai_response import build_prompt, get_ai_response

def process_question(query, filepath=None):
    doc_text = None
    if filepath:
        raw = extract_text_from_file(filepath)
        doc_text = clean_text(raw)
    prompt = build_prompt(query, doc_text)
    return get_ai_response(prompt)