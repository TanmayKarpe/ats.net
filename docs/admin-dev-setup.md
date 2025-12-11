# Admin Development Setup

## Overview

The ATS admin system uses environment-based authentication with a development fallback flow.

## Local Development Setup

### Step 1: Set the Development Key

The admin authentication system requires a development key via the `VITE_ADMIN_DEV_KEY` environment variable.

**Option A: Create a `.env.local` file (recommended)**

```bash
# .env.local
VITE_ADMIN_DEV_KEY=your_dev_key_here
VITE_USE_SUPABASE=false
```

Then run the dev server:

```bash
npm run dev
```

**Option B: Export as environment variable**

```bash
export VITE_ADMIN_DEV_KEY="your_dev_key_here"
npm run dev
```

### Step 2: Access the Admin Panel

1. Visit: `http://localhost:5173/admin/login`
2. Enter your development key
3. Click **Login**
4. You will be redirected to `/admin` (the admin dashboard)

## Paste-Once Dev Flow

If you forget to set `VITE_ADMIN_DEV_KEY`, the login page will show a modal prompting you to paste the key once:

1. When you visit `/admin/login` without the env var set
2. A dialog appears: "Development Key Required"
3. Paste your development key
4. Click **Continue** (or press Enter)
5. The key is stored in `sessionStorage` for this browser session only
6. Use the key to log in normally

**Important:** This sessionStorage key is cleared when you close the browser tab and is never persisted to localStorage.

## Auth State Storage

The authentication state is stored in `localStorage` under the key `ats_admin_auth_v1` with this structure:

```json
{
  "user": "admin",
  "loggedAt": "2025-12-11T10:30:00.000Z",
  "token": "random_string_here"
}
```

When you **logout**, this key is cleared immediately.

## Logout

Admin users can logout from the admin dashboard by clicking the **Logout** button. This:

1. Clears `ats_admin_auth_v1` from localStorage
2. Redirects to `/admin/login`

## Switching to Supabase (Future)

When ready to use Supabase for auth:

1. Set `VITE_USE_SUPABASE=true` in your `.env.local`
2. Configure Supabase credentials:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_KEY=your_anon_key
   ```
3. Update `AdminAuthContext.tsx` to use Supabase auth instead of environment-based auth

For now, the system falls back to local dev auth and shows a warning if Supabase is not configured.

## Testing Admin Routes

### Manual Testing

1. Visit `/admin/login` → should see login form
2. Enter correct dev key → redirected to `/admin`
3. Visit `/admin` while logged in → see dashboard
4. Visit `/admin` while NOT logged in → redirected to `/admin/login`
5. Click logout → redirected to `/admin/login`, auth cleared

### Automated Tests

Run the test suite:

```bash
npm run test  # or appropriate test command
```

Tests verify:
- ✓ Login success stores auth state
- ✓ Login failure shows error
- ✓ RequireAdmin redirects unauthenticated users
- ✓ Logout clears auth state

## Troubleshooting

### "Invalid development key"

- Check that `VITE_ADMIN_DEV_KEY` is set correctly
- Make sure there are no extra spaces in the key
- Restart the dev server after changing env vars

### Stuck on login page after refresh

- Check browser's localStorage for `ats_admin_auth_v1`
- If present, auth state should restore automatically
- If not present, you need to log in again

### Modal keeps appearing

- The paste-once modal only appears if `VITE_ADMIN_DEV_KEY` is not set
- Once you paste the key and continue, it's used for the current session
- To avoid it next time, set the env var in `.env.local`

## Security Notes

- **Development only:** This dev key system is for local development
- **Never commit secrets:** `.env.local` is in `.gitignore`
- **Session-only fallback:** The paste-once flow uses `sessionStorage`, cleared when tab closes
- **Future:** Supabase will provide secure, scalable authentication for production
