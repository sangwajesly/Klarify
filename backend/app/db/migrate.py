import json
import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables from .env file
load_dotenv()

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"

# Environment Variables
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

def migrate():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set.")
        return

    supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Connected to Supabase.")

    # 1. Migrate Concours
    print("Migrating Concours...")
    concours_file = DATA_DIR / "concours.json"
    if concours_file.exists():
        with open(concours_file, "r", encoding="utf-8") as f:
            concours_data = json.load(f)
            if concours_data:
                supabase.table("concours").upsert(concours_data).execute()
    
    # 2. Migrate Programs
    print("Migrating Programs...")
    programs_file = DATA_DIR / "programs.json"
    if programs_file.exists():
        with open(programs_file, "r", encoding="utf-8") as f:
            programs_data = json.load(f)
            db_programs = []
            for p in programs_data:
                # Transform data to match DB schema
                db_p = {
                    "id": p.get("id"),
                    "name": p.get("name"),
                    "university": p.get("university"),
                    "faculty": p.get("faculty"),
                    "durations": p.get("durations", 3),
                    "requires_concour": str(p.get("requiresConcour")).lower() == "true",
                    "concours_id": p.get("concours_id"),
                    "portal_url": p.get("portalUrl"),
                    "required_al_subjects": p.get("required_al_subjects"),
                    "tags": p.get("tags", []),
                    "careers": p.get("careers") or p.get("Careers", []),
                    "descriptions": p.get("descriptions")
                }
                db_programs.append(db_p)
            
            if db_programs:
                supabase.table("programs").upsert(db_programs).execute()

    # 3. Migrate Certifications
    print("Migrating Certifications...")
    certs_file = DATA_DIR / "certifications.json"
    if certs_file.exists():
        with open(certs_file, "r", encoding="utf-8") as f:
            certs_data = json.load(f)
            if certs_data:
                supabase.table("certifications").upsert(certs_data).execute()

    # 4. Migrate Books
    print("Migrating Books...")
    books_file = DATA_DIR / "books.json"
    if books_file.exists():
        with open(books_file, "r", encoding="utf-8") as f:
            books_data = json.load(f)
            if books_data:
                supabase.table("books").upsert(books_data).execute()

    print("Migration completed successfully.")

if __name__ == "__main__":
    migrate()
