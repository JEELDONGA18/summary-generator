from dotenv import load_dotenv
load_dotenv()

import os
import google.generativeai as genai

genai.configure(api_key=os.getenv("GEMINI_API_KEY")) 

model = genai.GenerativeModel("gemini-2.0-flash")

def build_prompt(query, doc_text=None):
    base = (
        "You are a helpful AI assistant that only answers questions based on uploaded internal company documents.\n\n"
    )
    if doc_text:
        base += f"Here is the document:\n{doc_text}\n\n"

    base += (
        f"Now answer the following question **only** using the above document content. "
        f"If it’s unrelated, say: 'Sorry, I can only answer questions related to the uploaded internal documents.'\n\n"
        f"User question: {query}"
    )
    return base

def get_ai_response(prompt):
    try:
        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"Gemini error: {str(e)}"
