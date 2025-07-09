# comparisor.py

from api import fetch_available_years, fetch_json
from typing import Optional
from config import BASIC_URL

def fetch_laws_for_year(year: int) -> Optional[list[dict]]:
    url = f"{BASIC_URL}/DU/{year}"
    data = fetch_json(url, error_prefix=f"Year {year}")
    if isinstance(data, dict) and "items" in data:
        return [item for item in data["items"] if item.get("type") == "Ustawa"]
    return []

def fetch_all_acts() -> list[dict]:
    years = fetch_available_years()
    if not years:
        return []
    
    all_laws = []
    for year in years:
        laws = fetch_laws_for_year(year)
        if laws:
            all_laws.extend(laws)
    return all_laws

def main():
    acts = fetch_all_acts()
    print(f"Foud {len(acts)} acts.")
    for u in acts[:5]: 
        print(f"{u['year']} - {u['title']}")

if __name__ == "__main__":
    main()
