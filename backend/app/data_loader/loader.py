import json
from pathlib import Path

# Base directory is one level up from the 'app' module, then into 'data'
DATA_DIR = Path(__file__).resolve().parent.parent.parent / "data"

class DataLoader:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataLoader, cls).__new__(cls)
            cls._instance._load_data()
        return cls._instance

    def _load_data(self):
        with open(DATA_DIR / "programs.json", "r", encoding="utf-8") as f:
            self.programs = json.load(f)
            
        with open(DATA_DIR / "concours.json", "r", encoding="utf-8") as f:
            # Map concours by ID for fast lookup
            concours_list = json.load(f)
            self.concours_map = {c["id"]: c for c in concours_list}
            
        with open(DATA_DIR / "certifications.json", "r", encoding="utf-8") as f:
            self.certifications = json.load(f)
            
        with open(DATA_DIR / "books.json", "r", encoding="utf-8") as f:
            self.books = json.load(f)

# Singleton instance
data_store = DataLoader()
