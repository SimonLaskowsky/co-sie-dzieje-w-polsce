import requests
from config import BASIC_URL, API_URL, CURRENT_YEAR, VOTING_URL

def fetch_one_law(eli):
    if not BASIC_URL:
        print("Error: DU_URL is not set in .env file")
        return None
        
    url = f"{BASIC_URL}//{eli}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print("API error:", response.status_code)
            return None
    except requests.exceptions.RequestException as e:
        print("Connection error:", e)
        return None

def get_voting_data(url):
    if not url:
        print("Error: url is not set")
        return None
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data
        else:
            print("API error:", response.status_code)
            return None
    except requests.exceptions.RequestException as e:
        print("Connection error:", e)
        return None

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