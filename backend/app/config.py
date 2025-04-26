from dotenv import load_dotenv
import os
from datetime import datetime
from pathlib import Path

load_dotenv()

API_URL = os.getenv("DU_URL")
CURRENT_YEAR = datetime.now().year
LAST_KNOWN_FILE = Path("last_known.json")