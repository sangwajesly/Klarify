# Supabase Setup Guide for Klarify

This guide walks through setting up Supabase for Klarify's database and authentication infrastructure.

## Prerequisites

- A Supabase account (https://supabase.com)
- A Supabase project created
- Backend environment variable file (`.env`) ready

---

## Phase 1: Database Setup

### Step 1: Create Tables and Indexes

1. Navigate to your Supabase Dashboard
2. Go to **SQL Editor** → **New Query**
3. Copy the entire contents of `backend/app/db/schema.sql`
4. Paste into the query editor
5. Click **Run**

This creates:

- `programs` table (81 academic programs)
- `concours` table (exam competitions)
- `certifications` table (professional certifications)
- `books` table (reference books)
- GIN indexes on `tags` columns for fast filtering
- Indexes on `faculty` and `university` for query optimization
- pgvector extension enabled for future ML embeddings

**Verification**: Go to **Table Editor** and confirm all 4 tables exist with proper columns.

### Step 2: Migrate Data from JSON to Postgres

1. Get your Supabase credentials:
   - **Project URL**: Dashboard → Settings → API → Project URL
   - **Service Role API Key**: Dashboard → Settings → API → Service Role Secret

2. Create `.env` file in `backend/` directory:

   ```bash
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. Run the migration script:

   ```bash
   cd backend
   python app/db/migrate.py
   ```

4. Expected output:

   ```
   Connected to Supabase.
   Migrating Concours...
   Migrating Programs...
   Migrating Certifications...
   Migrating Books...
   Migration completed successfully.
   ```

5. **Verification**:
   - Go to Supabase Table Editor
   - Click each table and confirm data is populated
   - Example: `programs` should show 81 rows

---

## Phase 2: Authentication Setup

### Step 1: Enable Auth Providers in Supabase Dashboard

1. Go to **Authentication** → **Providers**
2. Enable **Email/Password**:
   - Toggle switch to ON
   - Optional: Enable **Confirm email** if you want email verification
3. (Optional) Enable social providers:
   - Google: Click to configure
   - GitHub: Click to configure
   - Others as desired

### Step 2: Configure JWT Secret

1. Go to **Settings** → **API**
2. Note the **JWT Secret** value
3. Add to `.env`:
   ```bash
   SUPABASE_JWT_SECRET=your-jwt-secret-here
   ```

### Step 3: CORS Configuration (Optional)

If frontend and backend run on different origins:

1. Go to **Authentication** → **URL Configuration**
2. Add your frontend URL to **Redirect URLs**:
   ```
   http://localhost:5173
   https://www.klarifypath.com
   ```

---

## Phase 3: Backend Environment Variables

Complete `.env` file for backend:

```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Authentication
SUPABASE_JWT_SECRET=your-jwt-secret

# Development mode (allows unauthenticated access)
ENVIRONMENT=development
# or in production:
# ENVIRONMENT=production
```

---

## Phase 4: Frontend Setup

### Step 1: Install Supabase Client

```bash
cd klarify
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Client

Create `klarify/src/services/supabase.js`:

```javascript
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_KEY;

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
```

### Step 3: Create `.env.local` in frontend

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
```

Get `VITE_SUPABASE_KEY`:

- Dashboard → Settings → API → `anon` public key

### Step 4: Implement Auth in Frontend

Example sign-up:

```javascript
import { supabase } from "./services/supabase";

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) console.error("Sign up failed:", error.message);
  return data;
}
```

Example login:

```javascript
async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) console.error("Sign in failed:", error.message);
  return data.session;
}
```

Get current user:

```javascript
async function getCurrentUser() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
```

---

## Phase 5: API Integration

### Protected Endpoints

The backend now validates JWT tokens from Supabase Auth. To protect endpoints:

```python
from fastapi import Depends
from app.core.auth import get_current_user

@app.post("/api/recommendations")
async def get_recommendations(
    request: RecommendationRequest,
    current_user: dict = Depends(get_current_user)
):
    # current_user contains: {"id": "...", "email": "...", "role": "..."}
    return get_recommendations(request)
```

### Frontend API Calls with Token

```javascript
async function callProtectedAPI(endpoint, method = "GET", body = null) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${session.access_token}`,
  };

  const response = await fetch(`http://localhost:8000${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  return response.json();
}

// Usage
const recommendations = await callProtectedAPI("/api/recommendations", "POST", {
  subjects: ["Math", "Physics"],
  interest: ["AI", "ML"],
});
```

---

## Development Mode Notes

In development (`ENVIRONMENT=development`), the backend allows:

- Requests without auth headers (defaults to guest user)
- Easy local testing without tokens

In production (`ENVIRONMENT=production`):

- All requests require valid JWT tokens
- Missing tokens return 401 Unauthorized

---

## Troubleshooting

| Issue                                | Solution                                                         |
| ------------------------------------ | ---------------------------------------------------------------- |
| "SUPABASE_JWT_SECRET not configured" | Add `SUPABASE_JWT_SECRET` to `.env`                              |
| Migration script fails               | Check `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`             |
| Auth returns "audience invalid"      | Verify JWT secret matches Supabase project settings              |
| 401 Unauthorized on API calls        | Ensure token is passed in `Authorization: Bearer {token}` header |
| CORS errors on login                 | Add frontend URL to Supabase Redirect URLs                       |

---

## Next Steps

1. ✅ Database tables created
2. ✅ Data migrated to Postgres
3. ✅ Auth providers enabled
4. ✅ Backend JWT validation active
5. Implement frontend auth UI (sign up/login forms)
6. Test end-to-end flow: signup → login → API call
7. Deploy to production with `ENVIRONMENT=production`

---

## Security Checklist

- [ ] Never commit `.env` files to git (add to `.gitignore`)
- [ ] Rotate `SUPABASE_SERVICE_ROLE_KEY` after migration
- [ ] Use `anon` key for frontend, `service_role` only for backend migrations
- [ ] Enable email verification in Supabase Dashboard for production
- [ ] Set strong password requirements in Auth → Policies
- [ ] Enable Rate Limiting in Auth settings for production
- [ ] Review RLS (Row Level Security) policies before going live
