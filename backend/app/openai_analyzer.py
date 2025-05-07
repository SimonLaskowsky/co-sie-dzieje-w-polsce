import os
import json
import time
import logging
from openai import OpenAI, APIError
from dotenv import load_dotenv
from langchain.text_splitter import RecursiveCharacterTextSplitter
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
load_dotenv()

def get_openai_client():
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OpenAI API key missing.")
    return OpenAI(api_key=api_key)

@retry(stop=stop_after_attempt(5), wait=wait_exponential(multiplier=1, min=4, max=60), retry=retry_if_exception_type(APIError))
def analyze_text_with_openai(text, prompt, max_tokens=1000):
    logger.info(f"Processing text, length: {len(text)} characters")
    client = get_openai_client()
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}, {"role": "user", "content": text}],
            max_tokens=max_tokens
        )
        content = response.choices[0].message.content
        try:
            return json.loads(content) if "json" in prompt.lower() else content
        except json.JSONDecodeError:
            logger.error(f"Incorrect JSON: {content}")
            return {"error": "Incorrect response format", "raw_content": content}
    except APIError as e:
        logger.error(f"API error: {e}")
        raise
    finally:
        client.close()
    time.sleep(1.0)

def summarize_fragment(text):
    prompt = "Summarize this fragment of a legal document in Polish in 2-3 concise sentences, capturing key changes or provisions. Focus on the essence, avoiding redundant details."
    return analyze_text_with_openai(text, prompt, max_tokens=200)

def split_and_analyze_text(text, chunk_size=3000, chunk_overlap=200):
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap, length_function=len)
    chunks = text_splitter.split_text(text)
    logger.info(f “Split into {len(chunks)} fragments”)

    summaries = []
    for i, chunk in enumerate(chunks):
        logger.info(f “Abstract fragment {i+1}/{len(chunks)}”)
        summary = summarize_fragment(chunk)
        summaries.append(summary)

    combined_summary = "\n".join(summaries)
    logger.info(f"Abstracts merged, length: {len(combined_summary)} characters")

    analysis_prompt = (
        'Write a clear and concise summary of a law change in Polish, suitable for a homepage news tile or push notification. '
        'Return the result as a JSON object with two fields: "title": a short, informative headline (max 8 words, neutral tone, no first-person language), '
        '"content_html": a lightweight HTML text (<p>, <ul>, <li>, <strong>) containing: A slightly extended explanation of what has changed (3-5 sentences), '
        'If relevant, a simple explanation of the consequences or effects of the change (1-2 sentences), '
        'Avoid redundant comparisons like "before and after". The focus should be on the change itself, without explicitly comparing it to the past unless necessary for context. '
        'Write in a neutral and professional tone. Avoid unnecessary introductions ("this text informs..."). '
        'The input is a combined summary of a larger legal document; provide a cohesive summary based on this. '
        '**All output must be written in Polish.**'
    )
    return analyze_text_with_openai(combined_summary, analysis_prompt, max_tokens=1000)

def save_analysis_to_file(analysis, filename):
    try:
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(analysis, f, ensure_ascii=False, indent=2)
        logger.info(f "Saved analysis to {filename}")
    except Exception as e:
        logger.error(f"Write error: {e}")