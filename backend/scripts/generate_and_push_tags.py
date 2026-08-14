import os
import json
from pathlib import Path
from collections import Counter
from dotenv import load_dotenv
import pandas as pd
from supabase import create_client


BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
EXCEL_FILES = [DATA_DIR / 'University of Buea.xlsx', DATA_DIR / 'University of Bamenda.xlsx']


def load_example_programs():
    with open(DATA_DIR / 'programs.json', 'r', encoding='utf-8') as f:
        return json.load(f)


def normalize_row(row, col_map):
    def get(col):
        for k in col_map.get(col, []):
            if k in row and pd.notna(row[k]):
                return row[k]
        return None

    return {
        'id': get('id'),
        'name': get('name'),
        'university': get('university'),
        'faculty': get('faculty'),
        'required_al_subjects': get('required_al_subjects') or get('Required subject') or get('Required Subject'),
        'portal_url': get('portal_url') or get('Program_Url') or get('Program_Url'),
        'requires_concour': get('requires_concour') or get('Requires_Concour') or get('requiresConcour'),
        'tags': get('tags') or get('Tags'),
        'careers': get('careers') or get('Careers')
    }


def find_by_name_and_university(examples, name, university):
    if not name:
        return None
    name_lower = str(name).strip().lower()
    for p in examples:
        if p.get('name') and p.get('university'):
            if p['name'].strip().lower() == name_lower and p['university'].strip().lower() == str(university).strip().lower():
                return p
        # fallback: name match only
        if p.get('name') and p['name'].strip().lower() == name_lower:
            return p
    return None


def aggregate_by_faculty(examples, faculty, top_n=12):
    if not faculty:
        return [], []
    faculty_lower = str(faculty).strip().lower()
    tags = Counter()
    careers = Counter()
    for p in examples:
        if p.get('faculty') and faculty_lower in p.get('faculty', '').strip().lower():
            for t in p.get('tags', []) or []:
                tags[t] += 1
            for c in p.get('Careers', []) or p.get('careers', []) or []:
                careers[c] += 1
    top_tags = [t for t, _ in tags.most_common(top_n)]
    top_careers = [c for c, _ in careers.most_common(top_n)]
    return top_tags, top_careers


def generate_for_row(row_norm, examples):
    # If tags or careers present, normalize return
    tags = row_norm.get('tags')
    careers = row_norm.get('careers')

    # convert pandas string of list if present
    def parse_possible_list(v):
        if v is None:
            return None
        if isinstance(v, list):
            return v
        s = str(v).strip()
        if s.startswith('[') and s.endswith(']'):
            try:
                return json.loads(s)
            except Exception:
                pass
        # comma separated
        if ',' in s:
            return [x.strip() for x in s.split(',') if x.strip()]
        return [s]

    tags_parsed = parse_possible_list(tags)
    careers_parsed = parse_possible_list(careers)

    if tags_parsed and len(tags_parsed) > 0 and careers_parsed and len(careers_parsed) > 0:
        return tags_parsed, careers_parsed

    # try exact match in examples
    ex = find_by_name_and_university(examples, row_norm.get('name'), row_norm.get('university'))
    if ex:
        ex_tags = ex.get('tags') or []
        ex_careers = ex.get('Careers') or ex.get('careers') or []
        return ex_tags or tags_parsed or [], ex_careers or careers_parsed or []

    # aggregate by faculty
    agg_tags, agg_careers = aggregate_by_faculty(examples, row_norm.get('faculty'))
    if agg_tags or agg_careers:
        return agg_tags or tags_parsed or [], agg_careers or careers_parsed or []

    # fallback generic mapping based on simple keywords
    faculty = (row_norm.get('faculty') or '').lower()
    if 'science' in faculty or 'biology' in faculty or 'chemistry' in faculty:
        return ["Science", "Laboratory", "Research"], ["Research Scientist", "Laboratory Analyst"]
    if 'art' in faculty or 'humanities' in faculty or 'languages' in faculty:
        return ["Humanities", "Communication", "Education"], ["Educator", "Content Writer"]
    if 'econom' in faculty or 'management' in faculty or 'business' in faculty:
        return ["Business", "Finance", "Management"], ["Financial Accountant", "Marketing Specialist"]
    # last resort
    return ["General"], ["Professional"]


def process_file(path, examples, supabase):
    df = pd.read_excel(path)
    updates = []
    # column maps
    col_map = {
        'id': ['id', 'Program_id', 'Program ID', 'ProgramId'],
        'name': ['name', 'Name', 'Programme', 'Program Name'],
        'university': ['university', 'University'],
        'faculty': ['faculty', 'Faculty/School', 'Faculty', 'Faculty/School'],
        'tags': ['tags', 'Tags'],
        'careers': ['careers', 'Careers'],
        'required_al_subjects': ['required_al_subjects', 'Required subject', 'Required Subject'],
        'portal_url': ['portalUrl', 'Program_Url', 'Program Url', 'Program_Url']
    }

    for _, row in df.iterrows():
        norm = normalize_row(row, col_map)
        if not norm['id']:
            continue
        need_tags = not norm['tags'] or (isinstance(norm['tags'], float) and pd.isna(norm['tags']))
        need_careers = not norm['careers'] or (isinstance(norm['careers'], float) and pd.isna(norm['careers']))
        # pandas NaN handled above; for strings we checked existence
        if not need_tags and not need_careers:
            continue

        gen_tags, gen_careers = generate_for_row(norm, examples)

        payload = { 'id': str(norm['id']).strip() }
        if need_tags:
            payload['tags'] = gen_tags
        if need_careers:
            payload['careers'] = gen_careers

        updates.append(payload)

    if updates:
        print(f"Preparing to push {len(updates)} updates from {path.name} to Supabase (partial updates)...")
        success = 0
        failed = []
        for up in updates:
            pid = up.pop('id')
            # try direct id first
            res = supabase.table('programs').update(up).eq('id', pid).execute()
            data = getattr(res, 'data', None)
            if not data:
                # try normalized id (strip spaces)
                pid_norm = pid.replace(' ', '')
                if pid_norm != pid:
                    res2 = supabase.table('programs').update(up).eq('id', pid_norm).execute()
                    data = getattr(res2, 'data', None)
                    if data:
                        success += 1
                        continue
                failed.append(pid)
            else:
                success += 1

        print(f"Partial update summary: {success} succeeded, {len(failed)} failed.")
        if failed:
            print('Failed ids (no matching program found):', failed[:20])
    else:
        print(f"No updates needed for {path.name}")


def main():
    load_dotenv(BASE_DIR / '.env')
    SUPABASE_URL = os.getenv('SUPABASE_URL')
    SUPABASE_KEY = os.getenv('SUPABASE_KEY')
    if not SUPABASE_URL or not SUPABASE_KEY:
        print('Missing SUPABASE_URL or SUPABASE_KEY in environment.')
        return

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    examples = load_example_programs()

    total_updates = 0
    for f in EXCEL_FILES:
        if not f.exists():
            print('Missing file', f)
            continue
        process_file(f, examples, supabase)


if __name__ == '__main__':
    main()
