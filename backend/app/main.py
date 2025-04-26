from api import fetch_api_data
from storage import get_last_known, save_last_known
from pdf_utils import pdf_to_text, save_text_to_file
from datetime import datetime

def check_for_new_acts():
    items = fetch_api_data()
    if not items:
        return
    
    items.sort(
        key=lambda x: datetime.strptime(x["promulgation"], "%Y-%m-%d"),
        reverse=True
    )

    latest_act = items[0]
    last_known = get_last_known()
    
    if not last_known or latest_act["ELI"] != last_known["ELI"]:
        print("🔔 Nowy akt prawny!")
        save_last_known(latest_act)
    else:
        print("Brak nowych aktów.")

def save_latest_act():
    items = fetch_api_data()
    if not items:
        return
    
    latest = items[0]
    filtered_item = {
        "title": latest.get("title"),
        "references": latest.get("references"),
        "texts": latest.get("texts"),
        "type": latest.get("type"),
        "announcementDate": latest.get("announcementDate"),
        "changeDate": latest.get("changeDate"),
        "promulgation": latest.get("promulgation"),
        "status": latest.get("status"),
        "comments": latest.get("comments"),
        "keywords": latest.get("keywords"),
    }
    
    text = pdf_to_text('https://api.sejm.gov.pl/eli/acts/MP/2025/1/text.pdf')
    save_text_to_file(text, "sejm_akt.txt")

if __name__ == "__main__":
    check_for_new_acts()
    # save_latest_act()