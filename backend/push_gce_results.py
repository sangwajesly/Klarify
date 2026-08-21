"""
GCE Results 2026 — PDF Extractor & Supabase Uploader
=====================================================
Parses all 4 GCE result PDFs (OL, AL, TVEE-AL, TVEE-IL) and
uploads the structured candidate records to Supabase in batches.

Usage:
    python push_gce_results.py

Required env vars (in .env file):
    SUPABASE_URL=...
    SUPABASE_KEY=...  (use service_role key for direct inserts)
"""

import re
import os
import time
import fitz  # PyMuPDF
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

DATA_DIR = Path(__file__).resolve().parent / "data"

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Map each PDF file to its exam_type label
PDF_FILES = [
    {
        "file": "2026-GCE-OL-Results.pdf",
        "exam_type": "OL",
        "exam_year": 2026,
    },
    {
        "file": "2026-GCE-AL-General.pdf",
        "exam_type": "AL",
        "exam_year": 2026,
    },
    {
        "file": "2026-TVEE-AL-Results.pdf",
        "exam_type": "TVEE-AL",
        "exam_year": 2026,
    },
    {
        "file": "2026-TVEE-IL-Results.pdf",
        "exam_type": "TVEE-IL",
        "exam_year": 2026,
    },
]

BATCH_SIZE = 200          # Smaller batches to avoid HTTP/2 stream resets
MAX_RETRIES = 4           # Retry a failing batch up to 4 times
SLEEP_BETWEEN_BATCHES = 0.4  # Seconds to wait between each batch


def parse_pdf(filepath: Path, exam_type: str, exam_year: int) -> list[dict]:
    """
    Extract all candidate records from a GCE results PDF.

    The PDF format is:
        Centre No: XXXXX <CENTRE NAME>
        Regist: ..., Sat for ..., Passed: ...
        Passed in N Subjects: K
        CANDIDATE NAME
        (1)
        CANDIDATE NAME
        (2)
        ...
    """
    doc = fitz.open(str(filepath))
    records = []

    center_number = None
    center_name = None
    passed_category = None  # e.g. "Passed in 5 Subjects"

    # Regex patterns
    center_pattern = re.compile(
        r"Centre No:\s*(\d+)\s+(.+?)(?=Regist:|$)", re.DOTALL
    )
    passed_pattern = re.compile(r"(Passed in \d+ Subjects?)", re.IGNORECASE)
    # Names are ALL CAPS lines that are NOT numeric, not "Passed in", not "Centre No"
    # and not short headers
    name_exclusions = re.compile(
        r"^(\d+|Results of|Alphabetical|%|Regist|Sat for|Centre No|2026|GCE RESULTS|GENERAL CERT)",
        re.IGNORECASE,
    )

    for page in doc:
        text = page.get_text()
        lines = [line.strip() for line in text.splitlines() if line.strip()]

        for line in lines:
            # Detect centre header
            center_match = center_pattern.search(line)
            if center_match:
                center_number = center_match.group(1).strip()
                center_name = center_match.group(2).strip()
                # Clean trailing noise from center name
                center_name = re.split(r"Regist:|Sat for|%|\n", center_name)[0].strip()
                passed_category = None
                continue

            # Detect "Centre No: XXXXX" line split across lines
            if line.startswith("Centre No:"):
                parts = line.replace("Centre No:", "").strip().split(None, 1)
                if parts:
                    center_number = parts[0]
                    center_name = parts[1].strip() if len(parts) > 1 else center_name
                passed_category = None
                continue

            # Detect passed category header
            passed_match = passed_pattern.search(line)
            if passed_match:
                passed_category = passed_match.group(1).strip()
                continue

            # Skip numbering lines like (1), (2) ...
            if re.match(r"^\(\d+\)$", line):
                continue

            # Skip known non-name lines
            if name_exclusions.match(line):
                continue

            # If the line looks like an ALL CAPS name (at least 2 words)
            # Accept it if mostly uppercase
            words = line.split()
            if len(words) >= 2 and center_number:
                upper_ratio = sum(1 for w in words if w.isupper() or w.replace("'", "").replace("-", "").isupper()) / len(words)
                if upper_ratio >= 0.6:
                    records.append({
                        "exam_year": exam_year,
                        "exam_type": exam_type,
                        "center_number": center_number,
                        "center_name": center_name,
                        "candidate_name": line.strip(),
                        "passed_category": passed_category,
                    })

    doc.close()
    print(f"  Extracted {len(records):,} candidates from {filepath.name}")
    return records


def upload_to_supabase(supabase: Client, records: list[dict], exam_type: str):
    """
    Delete existing rows for this exam type/year then insert fresh records in batches.
    """
    year = records[0]["exam_year"] if records else 2026

    # Delete existing data for this exam type + year to allow clean re-run
    print(f"  Deleting existing {exam_type} {year} records...")
    supabase.table("gce_results") \
        .delete() \
        .eq("exam_year", year) \
        .eq("exam_type", exam_type) \
        .execute()

    total = len(records)
    inserted = 0

    for i in range(0, total, BATCH_SIZE):
        batch = records[i : i + BATCH_SIZE]

        # Retry loop with exponential backoff
        for attempt in range(1, MAX_RETRIES + 1):
            try:
                supabase.table("gce_results").insert(batch).execute()
                inserted += len(batch)
                print(f"    Uploaded {inserted:,}/{total:,}...", end="\r")
                break  # success — move to next batch
            except Exception as e:
                if attempt < MAX_RETRIES:
                    wait = 2 ** attempt  # 2s, 4s, 8s
                    print(f"\n    Batch {i//BATCH_SIZE+1} failed (attempt {attempt}/{MAX_RETRIES}): {e}. Retrying in {wait}s...")
                    time.sleep(wait)
                else:
                    print(f"\n    ERROR: Batch {i//BATCH_SIZE+1} failed after {MAX_RETRIES} attempts. Skipping.")

        time.sleep(SLEEP_BETWEEN_BATCHES)  # Throttle to avoid overwhelming Supabase

    print(f"  Done: {inserted:,} records uploaded for {exam_type} {year}.        ")


def main():
    if not SUPABASE_URL or not SUPABASE_KEY:
        print("ERROR: SUPABASE_URL and SUPABASE_KEY must be set in your .env file.")
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    print("Connected to Supabase.\n")

    for pdf_meta in PDF_FILES:
        filepath = DATA_DIR / pdf_meta["file"]
        if not filepath.exists():
            print(f"SKIPPING: {filepath.name} not found in data/")
            continue

        print(f"Processing: {filepath.name} ({pdf_meta['exam_type']})")
        records = parse_pdf(filepath, pdf_meta["exam_type"], pdf_meta["exam_year"])

        if records:
            upload_to_supabase(supabase, records, pdf_meta["exam_type"])
        else:
            print(f"  WARNING: No records extracted from {filepath.name}")

        print()

    print("All GCE 2026 results successfully pushed to Supabase!")


if __name__ == "__main__":
    main()
