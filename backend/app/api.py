import requests
from config import API_URL, CURRENT_YEAR

def fetch_api_data():
    if not API_URL:
        print("Błąd: DU_URL nie jest ustawiony w pliku .env")
        return None
    
    url = f"{API_URL}/{CURRENT_YEAR}"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            data = response.json()
            return data.get("items", [])
        else:
            print("Błąd API:", response.status_code)
            return None
    except requests.exceptions.RequestException as e:
        print("Błąd połączenia:", e)
        return None