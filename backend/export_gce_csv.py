"""
GCE Results 2026 — PDF to CSV Exporter
=======================================
Extracts all candidate records from the 4 GCE PDFs
and saves them as CSV files ready for Supabase bulk import.

Usage:
    python export_gce_csv.py

Output: data/csv/gce_2026_OL.csv, gce_2026_AL.csv, etc.
"""

import re
import csv
import fitz  # PyMuPDF
from pathlib import Path

DATA_DIR = Path(__file__).resolve().parent / "data"
CSV_DIR = DATA_DIR / "csv"
CSV_DIR.mkdir(exist_ok=True)

PDF_FILES = [
    {"file": "2026-GCE-OL-Results.pdf",    "exam_type": "OL",      "exam_year": 2026},
    {"file": "2026-GCE-AL-General.pdf",     "exam_type": "AL",      "exam_year": 2026},
    {"file": "2026-TVEE-AL-Results.pdf",    "exam_type": "TVEE-AL", "exam_year": 2026},
    {"file": "2026-TVEE-IL-Results.pdf",    "exam_type": "TVEE-IL", "exam_year": 2026},
]

COLUMNS = ["exam_year", "exam_type", "center_number", "center_name", "candidate_name", "passed_category"]

name_exclusions = re.compile(
    r"^(\d+|Results of|Alphabetical|%|Regist|Sat for|Centre No|2026|GCE RESULTS|GENERAL CERT|TECHNICAL|VOCATIONAL)",
    re.IGNORECASE,
)


def parse_pdf(filepath: Path, exam_type: str, exam_year: int) -> list[dict]:
    doc = fitz.open(str(filepath))
    records = []
    center_number = None
    center_name = None
    passed_category = None

    for page in doc:
        lines = [l.strip() for l in page.get_text().splitlines() if l.strip()]

        for line in lines:
            # Centre header
            if line.startswith("Centre No:"):
                parts = line.replace("Centre No:", "").strip().split(None, 1)
                center_number = parts[0] if parts else center_number
                center_name = re.split(r"Regist:|Sat for|%", parts[1])[0].strip() if len(parts) > 1 else center_name
                passed_category = None
                continue

            # Passed category header
            m = re.search(r"(Passed in \d+ Subjects?)", line, re.IGNORECASE)
            if m:
                passed_category = m.group(1).strip()
                continue

            # Skip ordinal numbers
            if re.match(r"^\(\d+\)$", line):
                continue

            # Skip non-name lines
            if name_exclusions.match(line):
                continue

            # Accept uppercase candidate names (>=2 words, >60% uppercase)
            words = line.split()
            if len(words) >= 2 and center_number:
                upper_ratio = sum(
                    1 for w in words
                    if w.replace("'", "").replace("-", "").replace(".", "").isupper()
                ) / len(words)
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


def main():
    total_all = 0

    for meta in PDF_FILES:
        filepath = DATA_DIR / meta["file"]
        if not filepath.exists():
            print(f"SKIPPING: {meta['file']} not found.")
            continue

        print(f"Processing: {meta['file']} ({meta['exam_type']})")
        records = parse_pdf(filepath, meta["exam_type"], meta["exam_year"])

        if not records:
            print("  WARNING: No records extracted.")
            continue

        out_file = CSV_DIR / f"gce_2026_{meta['exam_type'].replace('-', '_')}.csv"
        with open(out_file, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=COLUMNS)
            writer.writeheader()
            writer.writerows(records)

        print(f"  Saved to: {out_file.name}  ({len(records):,} rows)")
        total_all += len(records)
        print()

    print(f"Done! Total candidates exported: {total_all:,}")
    print(f"CSV files saved in: {CSV_DIR}")
    print()
    print("Next step: Import each CSV file into Supabase:")
    print("  1. Go to your Supabase Dashboard → Table Editor → gce_results")
    print("  2. Click 'Insert' → 'Import data from CSV'")
    print("  3. Upload each file one at a time")


if __name__ == "__main__":
    main()
