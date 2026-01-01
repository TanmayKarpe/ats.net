# Admin Development Setup Guide

This guide explains how to set up and use the admin login system locally for development and testing.

## Quick Start

### 1. Set Environment Variables

Create or edit `.env.local`:

```bash
VITE_ADMIN_DEV_KEY=your_dev_key_here
VITE_USE_SUPABASE=false
```

Replace `your_dev_key_here` with a secure development key (e.g., a random password, UUID, or shared team secret).

**Never commit `.env.local` to the repository.**

### 2. Run the Development Server

```bash
npm run dev
```

The app will start at `http://localhost:8080`.

### 3. Access Admin Login

Navigate to `/admin/login`.

### 4. Log In

- **If `VITE_ADMIN_DEV_KEY` is set:** Enter the key from `.env.local` and click **Login**.
- **If `VITE_ADMIN_DEV_KEY` is NOT set:** A modal will appear asking you to paste the dev key. Paste it once and click **Continue**. The key is stored in `sessionStorage` for the current session only (cleared when you close the tab/browser).

### 5. After Login

- You will be redirected to `/admin` (admin dashboard).
- The header will show a **Dashboard** link and a **Logout** button.
- Check your browser's **Developer Tools** → **Application** → **Storage** → **Local Storage** to see the `ats_admin_auth_v1` key with your auth state (JSON object with `user`, `token`, `loggedAt`).

### 6. Logout

Click the **Logout** button in the header or admin dashboard. Your auth state will be cleared from `localStorage`, and you'll be redirected to `/admin/login`.

---

## How It Works

### Paste-Once Modal (Dev Fallback)

If `VITE_ADMIN_DEV_KEY` environment variable is not set:

1. When you visit `/admin/login`, a modal appears: "Development Key Required"
2. Paste your dev key once
3. The key is stored in `sessionStorage` (browser memory, session-only)
4. You can now use the login form
5. On successful login, auth state is saved to `localStorage` under `ats_admin_auth_v1`
6. Closing the tab/browser clears the `sessionStorage` key (paste modal appears again next time)

**Why?** This allows developers to log in without hardcoding a secret in `.env.local` or `.env` files that might be accidentally committed.

### Auth Persistence

On successful login, the following JSON object is stored in `localStorage` under key `ats_admin_auth_v1`:

```json
{
  "user": "admin",
  "token": "random_token_string",
  "loggedAt": "2025-12-12T20:00:00.000Z"
}
```

- **Persists:** across browser reloads while logged in
- **Clears on logout:** removed from localStorage
- **No secrets stored:** the token is generated randomly on each login; the dev key is never persisted

### Route Protection

- **`/admin/login`** — Public. Accessible whether authenticated or not.
- **`/admin`** — Protected. If not authenticated, redirects to `/admin/login`.
- **Header updates:** Login/Admin buttons change based on auth state.

---

## Testing

### Run Tests Locally

```bash
npm test
```

This runs Vitest with tests in `src/__tests__/`:
- `admin-auth.test.tsx` — Tests login, logout, localStorage, RequireAdmin guard
- `header.test.tsx` — Tests header render and button visibility

### Run Tests in CI

Add the following to your CI environment (GitHub Actions, etc.):

```env
VITE_ADMIN_DEV_KEY=ci_test_key_12345
VITE_USE_SUPABASE=false
```

Do **not** commit these values to the repo. Instead, set them as GitHub Secrets or CI environment variables.

### Manual E2E Testing

1. Set `VITE_ADMIN_DEV_KEY=test` in `.env.local`
2. Run `npm run dev`
3. Open browser dev tools (F12)
4. Navigate to `/admin/login`
5. Enter `test` and click **Login**
6. Check **Application** → **Local Storage** → `ats_admin_auth_v1` (should exist)
7. Navigate to `/admin` (should load dashboard)
8. Click **Logout**
9. Check **Local Storage** again (key should be gone)
10. You should be redirected to `/admin/login`

---

## Migrating to Supabase (Future)

When you're ready to move to production with Supabase authentication:

1. Set `VITE_USE_SUPABASE=true` in `.env`
2. Configure Supabase credentials: `VITE_SUPABASE_URL` and `VITE_SUPABASE_KEY`
3. Update `AdminAuthContext.tsx` to use `supabase.auth.signInWithPassword()` instead of the dev key check
4. Existing tests can mock Supabase or use a test Supabase project

The dev fallback will remain disabled when `VITE_USE_SUPABASE=true`, so your admin login will use Supabase entirely.

---

## Troubleshooting

### "Development Key Required" modal keeps appearing

**Cause:** `VITE_ADMIN_DEV_KEY` is not set in `.env.local`.

**Solution:** 
- Create `.env.local` with `VITE_ADMIN_DEV_KEY=your_key`
- Restart `npm run dev`
- Or paste your key in the modal (this works for the current session only)

### Login fails with "Invalid development key"

**Cause:** The key you entered doesn't match `VITE_ADMIN_DEV_KEY`.

**Solution:**
- Check the value in `.env.local`
- Make sure you typed it correctly (case-sensitive)
- Confirm the file is saved and the dev server has reloaded

### `ats_admin_auth_v1` not in localStorage after login

**Cause:** Login didn't succeed, or localStorage is disabled/full.

**Solution:**
- Check browser console for errors (F12)
- Verify login returned success (check toast notification)
- Make sure localStorage is enabled (check privacy settings)
- Check available storage space (some browsers limit it)

### Logout doesn't redirect to `/admin/login`

**Cause:** Navigation failed or auth context not fully updated.

**Solution:**
- Check browser console for routing errors
- Manually navigate to `/admin/login`
- Hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

---

## Security Notes

- **Dev keys are not secrets:** They are for local development only. Use a simple, memorable string (e.g., `dev`, `test`, `local_admin`).
- **Paste-once modal:** Prevents accidental exposure of keys in env files, but is **not suitable for production**. Always migrate to proper auth (Supabase, OAuth, etc.) before deploying.
- **No HTTPS check in dev:** The dev fallback works in plain HTTP. In production, use only HTTPS + proper auth.
- **localStorage is NOT secure:** Do not store sensitive tokens in localStorage. In production, use secure HTTP-only cookies + proper backend validation.

---

## Quick Reference

| Scenario | Action |
|----------|--------|
| First time setup | Create `.env.local`, set `VITE_ADMIN_DEV_KEY`, run `npm run dev` |
| Forgot key | Check `.env.local` or use paste-once modal |
| Ran tests in CI | Set `VITE_ADMIN_DEV_KEY` as CI secret (do not commit) |
| Ready for Supabase | Set `VITE_USE_SUPABASE=true` and configure Supabase env vars |
| Check if logged in | Look for `ats_admin_auth_v1` in localStorage (F12 → Application) |

---

## Questions or Issues?

Refer to the test files in `src/__tests__/` for example implementations of login, logout, and route protection.

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
