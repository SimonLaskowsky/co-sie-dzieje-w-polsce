import os
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime

from openai_analyzer import split_and_analyze_text, save_analysis_to_file
from pdf_utils import pdf_to_text, save_text_to_file
from storage import get_last_known, save_last_known
from api import fetch_api_data, fetch_one_law, get_voting_data
from votes_calculator import get_sejm_voting_data
from database import save_to_database
from config import BASIC_URL, MAX_ACTS_TO_PROCESS, ACT_CONTENT_FILE, ACT_ANALYSIS_FILE, ELI_FOR_LATER, check_environment

def extract_last_vote_info(process_data: Dict[str, Any]) -> Tuple[Optional[int], Optional[int]]:
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

def get_new_acts(items: List[Dict[str, Any]], last_known: Dict[str, Any]) -> List[Dict[str, Any]]:
    new_acts = []
    for act in items:
        if act["ELI"] == last_known.get("ELI"):
            break
        new_acts.append(act)
    return new_acts

def save_eli_to_check_later(act_eli):
    try:
        with open(ELI_FOR_LATER, "r") as f:
            existing_eli = [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        existing_eli = []

    if act_eli not in existing_eli:
        existing_eli.append(act_eli)
        with open(ELI_FOR_LATER, "w") as f:
            for eli in existing_eli:
                f.write(f"{eli}\n")

def check_voting_details(act_eli: str ):
    act_details = fetch_one_law(act_eli)

    if not act_details:
        print(f"Error: Could not fetch details for act {act_eli}")
        return False

    voting_details = get_voting_details(act_details)
    if not voting_details:
        print(f"Error: Could not fetch voting details for act {act_eli}")
        save_eli_to_check_later(act_eli)
        return False

    return True

def process_and_save_act(latest: Dict[str, Any], text: str) -> bool:
    if not text:
        print(f"Error: No text for act {latest.get('title', 'unknown')}")
        return False
        
    save_text_to_file(text, str(ACT_CONTENT_FILE))
    
    analysis = split_and_analyze_text(text)
    save_analysis_to_file(analysis, str(ACT_ANALYSIS_FILE))
    
    analysis_dict = analysis if isinstance(analysis, dict) else json.loads(analysis)
    
    eli = latest.get("ELI")
    act_number = eli.split("/")[-1] if eli else None
    act_details = fetch_one_law(eli)
    
    if not act_details:
        print(f"Error: Could not fetch details for act {eli}")
        return False

    voting_details = get_voting_details(act_details)

    filtered_item = {
        "title": act_details.get("title"),
        "actNumber": act_number,
        "simpleTitle": analysis_dict.get("title"),
        "content": analysis_dict.get("content_html"),
        "references": act_details.get("references"),
        "texts": act_details.get("texts"),
        "type": act_details.get("type"),
        "announcementDate": act_details.get("announcementDate"),
        "changeDate": act_details.get("changeDate"),
        "promulgation": act_details.get("promulgation"),
        "status": act_details.get("status"),
        "comments": act_details.get("comments"),
        "keywords": act_details.get("keywords"),
        "file": f"{BASIC_URL}{eli}/text.pdf",
        "votes": voting_details
    }

    return save_to_database(filtered_item)

def get_voting_details(act_details: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    voting_details = None
    prints = act_details.get("prints", [])
    
    if prints and isinstance(prints, list):
        process_api_link = prints[0].get("linkProcessAPI")
        if process_api_link:
            voting_data = get_voting_data(process_api_link)
            if voting_data:
                sitting, voting_number = extract_last_vote_info(voting_data)
                if sitting and voting_number:
                    voting_details = get_sejm_voting_data(10, sitting, voting_number)
    
    return voting_details

# Function to fetch and filters acts. Filter it by type, only "Ustawa" and "Rozporządzenie" are allowed. Sort it by promulgation date descending (most recent at the top).
def fetch_and_filter_acts() -> List[Dict[str, Any]]:
    items = fetch_api_data()
    if not items:
        print("Error: Failed to fetch data from API")
        return []
    
    filtered_items = [item for item in items if item.get("type") in ["Ustawa", "Rozporządzenie"]]
    if not filtered_items:
        print("No legal acts meeting the criteria")
        return []

    filtered_items.sort(
        key=lambda x: datetime.strptime(x["promulgation"], "%Y-%m-%d"),
        reverse=True
    )
    
    return filtered_items

# Checking if file with last known act exists. If not, process all available acts. If exists, process only new acts until the last known one.
def identify_new_acts(items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    last_known = get_last_known()

    if not last_known:
        print("📄 No previously saved act found — processing all available legal acts...")
        return items
    
    new_acts = []

    for act in items:
        if act["ELI"] == last_known.get("ELI"):
            break

        print(act['type'], act['ELI'])

        if act['type'] in ["Ustawa"]:
            if check_voting_details(act["ELI"]):
                new_acts.append(act)
        else:
            new_acts.append(act)
    
    return new_acts

# Checking if single_act has text, if not, skip it. If yes, process it and save to database.
def process_single_act(act: Dict[str, Any]) -> bool:
    print(f"➡️ Processing act: {act.get('title', 'unknown')}")
    
    pdf_url = f"{BASIC_URL}{act.get('ELI')}/text.pdf"
    pdf_text = pdf_to_text(pdf_url)
    
    if not pdf_text:
        print(f"❌ Failed to fetch PDF text for act: {act.get('title')}")
        return False
        
    success = process_and_save_act(act, pdf_text)
    
    if success:
        print(f"✅ Act processed successfully: {act.get('title')}")
    else:
        print(f"❌ Error processing act: {act.get('title')}")
    
    return success

def check_for_new_acts() -> None:
    if not check_environment():
        print("Error: Missing required environment variables")
        return
    
    items = fetch_and_filter_acts()

    if not items:
        return
    
    new_acts = identify_new_acts(items)
    
    if new_acts:
        print(f"🔔 Found {len(new_acts)} new legal acts!")
        
        acts_to_process = new_acts[:MAX_ACTS_TO_PROCESS]
        
        for act in reversed(acts_to_process):
            process_single_act(act)

        if new_acts:
            save_last_known(new_acts[0])
    else:
        print("No new legal acts.")

def check_old_eli() -> None:
    try:
        with open(ELI_FOR_LATER, "r") as f:
            elis = [line.strip() for line in f.readlines()]
    except FileNotFoundError:
        elis = []

    if not elis:
        print("No ELI to check later.")
        return

    print(f"🔔 Found {len(elis)} ELI to check voting details later!")

    remaining_eli = []

    for eli in elis:
        if check_voting_details(eli):
            act_details = fetch_one_law(eli)
            if act_details:
                pdf_url = f"{BASIC_URL}{eli}/text.pdf"
                pdf_text = pdf_to_text(pdf_url)
                if pdf_text:
                    process_and_save_act(act_details, pdf_text)
                else:
                    print(f"❌ Failed to fetch PDF text for act: {act_details.get('title')}")
                    remaining_eli.append(eli)
            else:
                print(f"❌ Could not fetch details for act {eli}")
                remaining_eli.append(eli)
        else:
            remaining_eli.append(eli)

    if remaining_eli:
        with open(ELI_FOR_LATER, "w") as f:
            for eli in remaining_eli:
                f.write(f"{eli}\n")
    else:
        os.remove(ELI_FOR_LATER)
        print("All ELI processed successfully, removed the file.")

if __name__ == "__main__":
    check_for_new_acts()
    check_old_eli()