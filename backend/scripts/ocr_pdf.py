import os
import easyocr
import glob
from pathlib import Path

PAGES_DIR = Path(r"C:\Users\Sangwa Jesly\Downloads\uba_pages")
TEXT_OUT_DIR = Path(r"C:\Users\Sangwa Jesly\Downloads\uba_pages_text")
TEXT_OUT_DIR.mkdir(exist_ok=True)

def main():
    print("Initializing EasyOCR reader for English and French...")
    reader = easyocr.Reader(['en', 'fr'])
    
    image_paths = sorted(glob.glob(str(PAGES_DIR / "page_*.png")))
    print(f"Found {len(image_paths)} pages to OCR.")
    
    for img_path in image_paths:
        p_name = Path(img_path).stem
        txt_path = TEXT_OUT_DIR / f"{p_name}.txt"
        
        if txt_path.exists():
            print(f"Skipping {p_name} (already done)")
            continue
            
        print(f"Performing OCR on {p_name}...")
        try:
            result = reader.readtext(img_path, detail=0)
            text_content = "\n".join(result)
            
            with open(txt_path, "w", encoding="utf-8") as f:
                f.write(text_content)
            print(f"Saved OCR text for {p_name}")
        except Exception as e:
            print(f"Failed to OCR {p_name}: {e}")

if __name__ == "__main__":
    main()
