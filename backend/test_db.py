import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

url = os.environ.get('SUPABASE_URL')
key = 'sb_publishable_kyufHgBIz4oWAh5gz3nOug_0bUp1Xn4'

if not url or not key:
    print("Missing credentials")
    exit(1)

sb = create_client(url, key)

res = sb.table('programs').select('*').execute()
print(f'Total programs in Supabase: {len(res.data)}')

res2 = sb.table('institutions').select('*').execute()
print(f'Total institutions in Supabase: {len(res2.data)}')

print("\nSample programs:")
for p in res.data[:3]:
    print(f"- {p['name']} ({p.get('university', 'No Uni')}) | Approved: {p.get('is_approved')}")

