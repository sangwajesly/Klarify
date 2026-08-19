import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
supabase = create_client(url, key)

tables = ["institutions", "programs", "institution_members", "partner_payments"]

for table in tables:
    print(f"\n--- Columns in public.{table} ---")
    try:
        # Try to select a single row (or select with limit 0)
        res = supabase.table(table).select("*").limit(1).execute()
        if res.data:
            print("Existing columns:", list(res.data[0].keys()))
        else:
            # Table is empty, try to get column names by doing a select of a non-existent column to see error message 
            # Or run a mock insert with empty object (usually database returns column names in schema error or we can inspect)
            print("Table is empty. Trying to query all keys by inserting a dummy or checking system schema...")
            # We can use postgres system catalogs to retrieve columns!
            # Since we have service_role, we can run a select query against information_schema via RPC if defined,
            # or try to execute a select * which should work even if table is empty.
            # Wait, in PostgREST, a select("*") on an empty table returns [] but doesn't fail.
            # Let's try to query information_schema columns if possible?
            # PostgREST does not expose information_schema directly unless it's in the API schema.
            # But wait! We can select columns by querying postgres system schema if we can? No, usually not exposed.
            # Let's try to select some common columns to see if they exist.
            columns_to_check = {
                "institutions": ["id", "name", "slug", "type", "verification_status", "subscription_tier", "city", "campus", "logo_url", "website_url", "whatsapp_number", "admissions_email", "created_at"],
                "programs": ["id", "name", "university", "faculty", "durations", "requires_concour", "required_al_subjects", "tags", "careers", "descriptions", "institution_id", "campus", "degree_obtained", "tuition_fee_xaf", "is_approved", "admission_deadline"],
                "institution_members": ["id", "user_id", "institution_id", "role", "created_at"],
                "partner_payments": ["id", "institution_id", "amount", "currency", "provider", "provider_reference", "status", "metadata", "created_at"]
            }
            
            existing = []
            missing = []
            for col in columns_to_check[table]:
                try:
                    supabase.table(table).select(col).limit(1).execute()
                    existing.append(col)
                except Exception as col_err:
                    missing.append(col)
            print("Available columns:", existing)
            if missing:
                print("MISSING COLUMNS:", missing)
    except Exception as e:
        print(f"Failed to inspect {table}:", e)
