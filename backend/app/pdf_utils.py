import os
import fitz
import requests

def download_pdf(url, filename="temp.pdf"):
    response = requests.get(url)
    response.raise_for_status()
    with open(filename, "wb") as f:
        f.write(response.content)
    return filename

def pdf_to_text(url):
    temp_file = None
    text = ""
    try:
        temp_file = download_pdf(url)
        if not os.path.exists(temp_file):
            raise FileNotFoundError(f"File {temp_file} was not downloaded correctly.")
        doc = fitz.open(temp_file)
        for page in doc:
            text += page.get_text()
    except Exception as e:
        print(f"Error while processing PDF: {e}")
    finally:
        if temp_file and os.path.exists(temp_file):
            os.remove(temp_file)
    return text

def save_text_to_file(text, filename):
    try:
        with open(filename, "w", encoding="utf-8") as f:
            f.write(text)
        print(f"✅ Text saved to file: {filename}")
    except Exception as e:
        print(f"❌ Error while saving to file: {e}")
