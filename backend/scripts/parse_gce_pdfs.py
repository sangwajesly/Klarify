import os
import re
import fitz  # PyMuPDF
import glob
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase setup
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

def determine_exam_type(filename: str) -> str:
    """
    Infers the exam type from the PDF filename.
    """
    name = filename.lower()
    
    is_tve = 'tve' in name or 'technical' in name
    # Check for 'al' or 'a-level' or 'advanced'
    is_a_level = 'a_level' in name or '-al-' in name or 'al-' in name or 'advanced' in name
    
    if is_tve:
        # TVEE has AL (Advanced Level) and IL (Intermediate Level / O-Level)
        return 'TVE_A' if is_a_level else 'TVE_O'
    else:
        # GCE has AL and OL
        return 'GEN_A' if is_a_level else 'GEN_O'

def parse_gce_pdf(pdf_path: str, exam_year: int, exam_type: str, supabase: Client):
    """
    Parses a GCE results PDF and extracts candidate records.
    """
    # Regex patterns based on GCE format
    center_pattern = re.compile(r"^Centre No:\s*(\d+)\s+(.*)", re.IGNORECASE)
    category_pattern = re.compile(r"^Passed in (.*?):\s*\d+", re.IGNORECASE)
    candidate_pattern = re.compile(r"^\(\d+\)\s+(.*)")
    
    current_center_number = None
    current_center_name = None
    current_category = None
    
    records = []
    
    print(f"--> Reading {os.path.basename(pdf_path)}...")
    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"    Failed to open PDF: {e}")
        return

    for page_num in range(len(doc)):
        page = doc[page_num]
        
        # Using "blocks" is critical for multi-column PDFs. 
        # It groups text by visual blocks (columns) rather than reading straight across.
        blocks = page.get_text("blocks", sort=True)
        
        for block in blocks:
            text = block[4]
            previous_line = None
            for line in text.split('\n'):
                line = line.strip()
                if not line:
                    continue
                
                # Check for Center Header
                center_match = center_pattern.match(line)
                if center_match:
                    current_center_number = center_match.group(1).strip()
                    current_center_name = center_match.group(2).strip()
                    current_category = None # Reset category when a new center starts
                    previous_line = line
                    continue
                
                # Check for Passed Category
                category_match = category_pattern.match(line)
                if category_match:
                    current_category = category_match.group(1).strip()
                    previous_line = line
                    continue
                
                # Check for Candidate Name
                candidate_match_inline = candidate_pattern.match(line)
                index_only_match = re.match(r"^\(\d+\)$", line)
                
                candidate_name = None
                
                if candidate_match_inline:
                    candidate_name = candidate_match_inline.group(1).strip()
                elif index_only_match and previous_line:
                    candidate_name = previous_line.strip()
                
                if candidate_name and current_center_number:
                    records.append({
                        "exam_year": exam_year,
                        "exam_type": exam_type,
                        "center_number": current_center_number,
                        "center_name": current_center_name,
                        "candidate_name": candidate_name,
                        "passed_category": current_category
                    })
                    
                    # Batch insert to avoid massive memory buildup
                    if len(records) >= 1000:
                        print(f"    Pushing batch of 1000 records to Supabase...")
                        supabase.table("gce_results").insert(records).execute()
                        records = []
                        
                previous_line = line
                    
    # Insert remaining records
    if records:
        print(f"    Pushing final batch of {len(records)} records to Supabase...")
        supabase.table("gce_results").insert(records).execute()
        
    print(f"    Done! Extracted candidates for {exam_type}.")

def process_directory(directory_path: str, exam_year: int):
    if not url or not key:
        print("Error: SUPABASE_URL and SUPABASE_KEY must be set in your .env file.")
        return
        
    supabase: Client = create_client(url, key)
    
    # Find all PDFs in the given directory
    pdf_files = glob.glob(os.path.join(directory_path, "*.pdf"))
    if not pdf_files:
        print(f"No PDF files found in directory: {directory_path}")
        print("Please place the GCE PDF files there and try again.")
        return
        
    print(f"==================================================")
    print(f"🚀 Found {len(pdf_files)} PDF(s). Starting autonomous extraction...")
    print(f"==================================================\n")
    
    for pdf_path in pdf_files:
        filename = os.path.basename(pdf_path)
        exam_type = determine_exam_type(filename)
        
        print(f"[{exam_type}] Auto-detected type from filename '{filename}'")
        parse_gce_pdf(pdf_path, exam_year, exam_type, supabase)
        print("-" * 50)
        
    print("\n✅ All PDFs processed successfully! The database is live.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 3:
        print("Usage: python parse_gce_pdfs.py <directory_path> <exam_year>")
        print("Example: python parse_gce_pdfs.py data/ 2025")
        sys.exit(1)
        
    directory_path = sys.argv[1]
    exam_year = int(sys.argv[2])
    
    process_directory(directory_path, exam_year)
