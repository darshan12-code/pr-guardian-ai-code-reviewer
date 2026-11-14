import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GEMINI_MODEL = os.getenv("GEMINI_MODEL","gemini-3.8-flash")


if not GEMINI_API_KEY:
    raise RuntimeError(
        
        "GEMINI_API_KEY is missing."
        "Please configure backend/.env"
    )
