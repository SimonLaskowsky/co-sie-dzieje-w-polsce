import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
        
    if not api_key:
        raise ValueError("Nie znaleziono klucza API OpenAI. Dodaj OPENAI_API_KEY do pliku .env.")
        
    return OpenAI(api_key=api_key)

def analyze_text_with_openai(text, prompt='Write a clear and concise summary of a law change in Polish, suitable for a homepage news tile or push notification. Return the result as a JSON object with two fields: "title": a short, informative headline (max 8 words, neutral tone, no first-person language), "content_html": a lightweight HTML text (<p>, <ul>, <li>, <strong>) containing: A slightly extended explanation of what has changed (3–5 sentences), If relevant, a simple explanation of the consequences or effects of the change (1–2 sentences), Avoid redundant comparisons like "before and after". The focus should be on the change itself, without explicitly comparing it to the past unless necessary for context. Write in a neutral and professional tone. Avoid unnecessary introductions ("this text informs..."). Keep the text readable and suitable for a website tile or a push notification.'):
    try:
        client = get_openai_client()
        
        response = client.chat.completions.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": text}
            ],
            max_tokens=1000
        )
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Błąd podczas komunikacji z OpenAI: {e}")
        return f"Nie udało się uzyskać analizy: {str(e)}"

def save_analysis_to_file(analysis, filename):
    with open(filename, "w", encoding="utf-8") as f:
        f.write(analysis)
    print(f"Zapisano analizę OpenAI do pliku {filename}")