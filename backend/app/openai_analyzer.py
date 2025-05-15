import os
import json
import time
import logging
from typing import Dict, Any, List, Optional, Union
from openai import OpenAI, APIError
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from contextlib import contextmanager

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

load_dotenv()

@contextmanager
def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key missing.")
    
    client = OpenAI(api_key=api_key)
    try:
        yield client
    finally:
        client.close()

@retry(
    stop=stop_after_attempt(5), 
    wait=wait_exponential(multiplier=1, min=4, max=60), 
    retry=retry_if_exception_type(APIError)
)
def analyze_text_with_openai(text: str, prompt: str, max_tokens: int = 1000) -> Union[Dict[str, Any], str]:
    logger.info(f"Processing text, length: {len(text)} characters")
    
    try:
        with get_openai_client() as client:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": prompt}, 
                    {"role": "user", "content": text}
                ],
                max_tokens=max_tokens
            )
            content = response.choices[0].message.content
            
            if "json" in prompt.lower():
                try:
                    return json.loads(content)
                except json.JSONDecodeError:
                    logger.error(f"Invalid JSON format: {content}")
                    return {"error": "Invalid response format", "raw_content": content}
            return content
    except APIError as e:
        logger.error(f"API error: {e}")
        raise
    
    time.sleep(1.0)

def summarize_fragment(text: str) -> str:
    prompt = "Podsumuj ten fragment dokumentu prawnego w języku polskim w 2-3 zwięzłych zdaniach, wychwytując kluczowe zmiany lub przepisy. Skup się na istocie, unikając zbędnych szczegółów."
    return analyze_text_with_openai(text, prompt, max_tokens=200)

def split_and_analyze_text(text: str, chunk_size: int = 3000, chunk_overlap: int = 200) -> Dict[str, Any]:
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size, 
        chunk_overlap=chunk_overlap, 
        length_function=len
    )
    chunks = text_splitter.split_text(text)
    logger.info(f"Split into {len(chunks)} chunks")

    summaries = []
    for i, chunk in enumerate(chunks):
        logger.info(f"Summarizing chunk {i+1}/{len(chunks)}")
        summary = summarize_fragment(chunk)
        summaries.append(summary)

    combined_summary = "\n".join(summaries)
    logger.info(f"Summaries combined, length: {len(combined_summary)} characters")

    analysis_prompt = (
        'Napisz jasne i zwięzłe podsumowanie zmiany prawnej w języku polskim, odpowiednie dla wiadomości na stronie głównej lub powiadomienia push. '
        'Zwróć wynik jako obiekt JSON z dwoma polami: "title": krótki, informacyjny nagłówek (maks. 8 słów, neutralny ton, bez języka pierwszoosobowego), '
        '"content_html": lekki tekst HTML (<p>, <ul>, <li>, <strong>), zawierający: Nieco rozszerzone wyjaśnienie, co się zmieniło (3-5 zdań), '
        'Jeśli istotne, proste wyjaśnienie konsekwencji lub skutków zmiany (1-2 zdania), '
        'Unikaj zbędnych porównań typu "przed i po". Skup się na samej zmianie, bez wyraźnego porównania jej z przeszłością, chyba że jest to konieczne dla kontekstu. '
        'Pisz neutralnym i profesjonalnym tonem. Unikaj niepotrzebnych wstępów ("ten tekst informuje..."). '
        'Dane wejściowe to połączone streszczenie większego dokumentu prawnego; przedstaw spójne podsumowanie na tej podstawie. '
        '**Cała treść musi być napisana w języku polskim.**'
    )
    return analyze_text_with_openai(combined_summary, analysis_prompt, max_tokens=1000)

def save_analysis_to_file(analysis: Union[Dict[str, Any], str], filename: str) -> None:
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(analysis, f, ensure_ascii=False, indent=2)
        logger.info(f"Analysis saved to {filename}")
    except Exception as e:
        logger.error(f"Save error: {e}")