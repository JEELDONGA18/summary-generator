#app.services.document_reader.py
from unstructured.partition.auto import partition

def extract_text_unstructured(filepath):
    try:
        elements = partition(filepath)
        return "\n".join([element.text for element in elements if hasattr(element, 'text')])
    except Exception as e:
        return f"Error reading file: {e}"