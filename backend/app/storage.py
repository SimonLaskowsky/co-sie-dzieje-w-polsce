import json
from config import LAST_KNOWN_FILE

def get_last_known():
    if LAST_KNOWN_FILE.exists():
        with open(LAST_KNOWN_FILE, "r") as f:
            return json.load(f)
    return None

def save_last_known(act):
    with open(LAST_KNOWN_FILE, "w") as f:
        json.dump(act, f)