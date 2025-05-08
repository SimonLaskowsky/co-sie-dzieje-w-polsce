import os
import json
from datetime import datetime
from openai_analyzer import split_and_analyze_text, save_analysis_to_file
from pdf_utils import pdf_to_text, save_text_to_file
from storage import get_last_known, save_last_known
from api import fetch_api_data, fetch_one_law, get_voting_data
from votes_calculator import get_sejm_voting_data
from dotenv import load_dotenv
from database import save_to_database

load_dotenv()

BASIC_URL = os.getenv("BASIC_URL")

def extract_last_vote_info(process_data):
    stages = process_data.get("stages", [])
    last_vote = None

    for stage in stages:
        stage_entries = stage.get("children", []) if "children" in stage else [stage]

        for entry in stage_entries:
            if entry.get("stageName", "").lower() == "głosowanie":
                last_vote = entry

    if last_vote and "voting" in last_vote:
        sitting = last_vote["voting"].get("sitting")
        voting_number = last_vote["voting"].get("votingNumber")
        return sitting, voting_number

    return None, None


def get_new_acts(items, last_known):
    new_acts = []
    for act in items:
        if act["ELI"] == last_known.get("ELI"):
            break
        new_acts.append(act)
    return new_acts

def process_and_save_act(latest, text):
    save_text_to_file(text, "act_content.txt")
    
    # analysis = split_and_analyze_text(text)
    # save_analysis_to_file(analysis, "act_analysis.json")
    
    # analysis_dict = analysis if isinstance(analysis, dict) else json.loads(analysis)
    
    eli = latest.get("ELI")
    act_number = eli.split("/")[-1]
    latest = fetch_one_law(eli);

    process_data = None
    voting_details = None
    prints = latest.get("prints", [])
    if prints and isinstance(prints, list):
        process_api_link = prints[0].get("linkProcessAPI")
        voting_data = get_voting_data(process_api_link)

        sitting, voting_number = extract_last_vote_info(voting_data)
        if sitting and voting_number:
            voting_details = get_sejm_voting_data(10, sitting, voting_number)

    filtered_item = {
        "title": latest.get("title"),
        "actNumber": act_number,
        # "simpleTitle": analysis_dict.get("title"),
        # "content": analysis_dict.get("content_html"),
        "references": latest.get("references"),
        "texts": latest.get("texts"),
        "type": latest.get("type"),
        "announcementDate": latest.get("announcementDate"),
        "changeDate": latest.get("changeDate"),
        "promulgation": latest.get("promulgation"),
        "status": latest.get("status"),
        "comments": latest.get("comments"),
        "keywords": latest.get("keywords"),
        "file": BASIC_URL + eli + '/text.pdf',
        "processData": process_data,
        "votes": voting_details
    }

    # print(filtered_item)
    # return
    save_to_database(filtered_item)

def save_latest_act(latest):
    
    process_and_save_act(latest, 'https://api.sejm.gov.pl/eli/acts'+latest.get('eli')+'text.pdf')

    return "Analiza zapisana do bazy danych"

def check_for_new_acts():
    items = fetch_api_data()
    items = [item for item in items if item.get("type") in ["Ustawa", "Rozporządzenie"]]

    if not items:
        return
    items.sort(
        key=lambda x: datetime.strptime(x["promulgation"], "%Y-%m-%d"),
        reverse=True
    )

    last_known = get_last_known()

    if not last_known:
        print("📄 Brak zapisanego ostatniego aktu — przetwarzanie wszystkich dostępnych aktów...")
        new_acts = items 
    else:
        new_acts = get_new_acts(items, last_known)

    if new_acts:
        # print(f"🔔 Znaleziono {len(new_acts)} nowych aktów prawnych!")
        for i, act in enumerate(reversed(new_acts)):
            if(i > 11):
                return
            # print(f"➡️ Przetwarzanie aktu: {act['title']}")
            if(i > 10):
                pdf_url = BASIC_URL + act.get('ELI') + '/text.pdf'
                pdf_text = pdf_to_text(pdf_url)
                process_and_save_act(act, pdf_text)

        save_last_known(new_acts[0])

    else:
        print("Brak nowych aktów.")

if __name__ == "__main__":
    check_for_new_acts()
