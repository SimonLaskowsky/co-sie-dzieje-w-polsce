import requests
from dotenv import load_dotenv
import os
import json
from datetime import datetime
from pathlib import Path

load_dotenv()
api_url = os.getenv("DU_URL")
current_year = datetime.now().year
LAST_KNOWN_FILE = Path("last_known.json")

def fetch_api_data():
    if not api_url:
        print("Błąd: DU_URL nie jest ustawiony w pliku .env")
        return None
    url = f"{api_url}/{current_year}"
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

def get_last_known():
    if LAST_KNOWN_FILE.exists():
        with open(LAST_KNOWN_FILE, "r") as f:
            return json.load(f)
    return None

def save_last_known(act):
    with open(LAST_KNOWN_FILE, "w") as f:
        json.dump(act, f)

def main():
    items = fetch_api_data()
    if not items:
        return
    latest_act = items[0]
    last_known = get_last_known()
    if not last_known or latest_act["ELI"] != last_known["ELI"]:
        print("🔔 Nowy akt prawny!")
        save_last_known(latest_act)
    else:
        print("Brak nowych aktów.")

if __name__ == "__main__":
    main()
