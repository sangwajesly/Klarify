import json
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_DIR = BASE_DIR / "data"
OUTPUT_SQL = Path(__file__).resolve().parent / "migration_data.sql"

def escape_sql_string(val):
    if val is None:
        return "NULL"
    # Escape single quotes for SQL
    return f"'{str(val).replace("'", "''")}'"

def format_sql_array(arr):
    if not arr:
        return "'{}'::TEXT[]"
    escaped_items = [f"'{str(item).replace("'", "''")}'" for item in arr]
    return f"ARRAY[{', '.join(escaped_items)}]::TEXT[]"

def generate_sql():
    sql_lines = []
    
    # 1. Load concours
    concours_file = DATA_DIR / "concours.json"
    if concours_file.exists():
        with open(concours_file, "r", encoding="utf-8") as f:
            concours = json.load(f)
            sql_lines.append("-- Migrate Concours")
            for c in concours:
                c_id = escape_sql_string(c.get("id"))
                name = escape_sql_string(c.get("name"))
                month = escape_sql_string(c.get("month"))
                deadline = escape_sql_string(c.get("deadline"))
                fee = c.get("fee", 0)
                sql_lines.append(
                    f"INSERT INTO concours (id, name, month, deadline, fee) "
                    f"VALUES ({c_id}, {name}, {month}, {deadline}, {fee}) "
                    f"ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, month=EXCLUDED.month, deadline=EXCLUDED.deadline, fee=EXCLUDED.fee;"
                )
            sql_lines.append("")

    # 2. Load programs
    programs_file = DATA_DIR / "programs.json"
    if programs_file.exists():
        with open(programs_file, "r", encoding="utf-8") as f:
            programs = json.load(f)
            sql_lines.append("-- Migrate Programs")
            for p in programs:
                p_id = escape_sql_string(p.get("id"))
                name = escape_sql_string(p.get("name"))
                uni = escape_sql_string(p.get("university"))
                faculty = escape_sql_string(p.get("faculty"))
                duration = p.get("durations", 3)
                
                # Convert string 'true'/'false' to SQL boolean
                req_concour_str = str(p.get("requiresConcour", "false")).lower()
                requires_concour = "TRUE" if req_concour_str == "true" else "FALSE"
                
                concours_id = escape_sql_string(p.get("concours_id"))
                portal_url = escape_sql_string(p.get("portalUrl"))
                req_al = escape_sql_string(p.get("required_al_subjects"))
                tags = format_sql_array(p.get("tags", []))
                careers = format_sql_array(p.get("Careers", []))
                desc = escape_sql_string(p.get("descriptions"))
                degree_obtained = escape_sql_string(p.get("degree_obtained") or p.get("degreeObtained") or p.get("degree"))
                tuition_fee = p.get("tuition_fee_xaf") if p.get("tuition_fee_xaf") is not None else p.get("tuition_fee")
                tuition_fee_sql = str(tuition_fee) if tuition_fee is not None else "NULL"
                
                sql_lines.append(
                    f"INSERT INTO programs (id, name, university, faculty, durations, requires_concour, concours_id, portal_url, required_al_subjects, tags, careers, descriptions, degree_obtained, tuition_fee_xaf) "
                    f"VALUES ({p_id}, {name}, {uni}, {faculty}, {duration}, {requires_concour}, {concours_id}, {portal_url}, {req_al}, {tags}, {careers}, {desc}, {degree_obtained}, {tuition_fee_sql}) "
                    f"ON CONFLICT (id) DO UPDATE SET name=EXCLUDED.name, university=EXCLUDED.university, faculty=EXCLUDED.faculty, durations=EXCLUDED.durations, "
                    f"requires_concour=EXCLUDED.requires_concour, concours_id=EXCLUDED.concours_id, portal_url=EXCLUDED.portal_url, required_al_subjects=EXCLUDED.required_al_subjects, "
                    f"tags=EXCLUDED.tags, careers=EXCLUDED.careers, descriptions=EXCLUDED.descriptions, degree_obtained=EXCLUDED.degree_obtained, tuition_fee_xaf=EXCLUDED.tuition_fee_xaf;"
                )
            sql_lines.append("")

    # 3. Load certifications
    certs_file = DATA_DIR / "certifications.json"
    if certs_file.exists():
        with open(certs_file, "r", encoding="utf-8") as f:
            certs = json.load(f)
            sql_lines.append("-- Migrate Certifications")
            for cert in certs:
                c_id = cert.get("id")
                title = escape_sql_string(cert.get("title"))
                provider = escape_sql_string(cert.get("provider"))
                url = escape_sql_string(cert.get("url"))
                tags = format_sql_array(cert.get("tags", []))
                sql_lines.append(
                    f"INSERT INTO certifications (id, title, provider, url, tags) "
                    f"VALUES ({c_id}, {title}, {provider}, {url}, {tags}) "
                    f"ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, provider=EXCLUDED.provider, url=EXCLUDED.url, tags=EXCLUDED.tags;"
                )
            sql_lines.append("")

    # 4. Load books
    books_file = DATA_DIR / "books.json"
    if books_file.exists():
        with open(books_file, "r", encoding="utf-8") as f:
            books = json.load(f)
            sql_lines.append("-- Migrate Books")
            for b in books:
                b_id = b.get("id")
                title = escape_sql_string(b.get("title"))
                author = escape_sql_string(b.get("author"))
                url = escape_sql_string(b.get("url"))
                tags = format_sql_array(b.get("tags", []))
                sql_lines.append(
                    f"INSERT INTO books (id, title, author, url, tags) "
                    f"VALUES ({b_id}, {title}, {author}, {url}, {tags}) "
                    f"ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, url=EXCLUDED.url, tags=EXCLUDED.tags;"
                )
            sql_lines.append("")

    # Write SQL to file
    with open(OUTPUT_SQL, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_lines))
    print(f"Successfully generated SQL migration script at: {OUTPUT_SQL}")

if __name__ == "__main__":
    generate_sql()
