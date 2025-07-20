import os
import textract
import PyPDF2

def extract_text_from_file(filepath):
    ext = os.path.splitext(filepath)[1].lower()
    
    if ext == '.txt':
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    
    elif ext == '.pdf':
        try:
            with open(filepath, 'rb') as f:
                reader = PyPDF2.PdfReader(f)
                text = ''
                for page in reader.pages:
                    text += page.extract_text() or ''
                return text
        except Exception as e:
            print(f"PDF error: {e}")
            return ""

    elif ext in ['.doc', '.docx']:
        try:
            text = textract.process(filepath).decode('utf-8')
            return text
        except Exception as e:
            print(f"DOCX error: {e}")
            return ""

    else:
        return "Unsupported file format."


def clean_text(text):
    return text.replace('\n', ' ').strip()