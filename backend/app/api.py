import requests
from config import API_URL, CURRENT_YEAR

def fetch_api_data():
    if not API_URL:
        print("Error: DU_URL is not set in .env file")
        return None
    
    url = f"{API_URL}/{CURRENT_YEAR}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("items", [])
        else:
            print("API error:", response.status_code)
            return None
    except requests.exceptions.RequestException as e:
        print("Connection error:", e)
        return None