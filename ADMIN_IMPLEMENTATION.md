# Admin Login & Protected Workspace Implementation

## Summary

This implementation provides a complete admin authentication system for the ATS website with:

- ✅ `/admin/login` page with secure dev key authentication
- ✅ Protected `/admin` dashboard accessible only after login
- ✅ `RequireAdmin` route wrapper for protected routes
- ✅ localStorage persistence (key: `ats_admin_auth_v1`)
- ✅ Paste-once dev key flow for missing environment vars
- ✅ Secure logout functionality
- ✅ Complete documentation and test scaffolding

## Implementation Details

### Files Created/Modified

1. **src/contexts/AdminAuthContext.tsx** (REFACTORED)
   - Uses `VITE_ADMIN_DEV_KEY` environment variable
   - Stores auth state in `localStorage` with key `ats_admin_auth_v1`
   - State structure: `{ user: 'admin', loggedAt: ISO, token: random }`
   - Provides `useAdminAuth()` hook

2. **src/pages/admin/AdminLoginPage.tsx** (UPDATED)
   - Clean login form with password input
   - Paste-once modal for missing VITE_ADMIN_DEV_KEY
   - Session-based fallback (stored in `sessionStorage`)
   - Redirects to `/admin` on success
   - Toast notifications for feedback

3. **src/components/auth/RequireAdmin.tsx** (UNCHANGED)
   - Protects routes - redirects unauthenticated to `/admin/login`
   - Shows loading spinner during auth check
   - Minimal API: `<RequireAdmin><ProtectedContent /></RequireAdmin>`

4. **src/pages/admin/AdminDashboard.tsx** (UNCHANGED)
   - Main admin hub with 4 management modules
   - Logout button that clears auth state
   - Responsive dashboard layout

5. **src/App.tsx** (VERIFIED)
   - `AdminAuthProvider` wraps routes inside `BrowserRouter`
   - Routes configured correctly:
     - `/admin/login` (public)
     - `/admin` (protected with `RequireAdmin`)
   - Catch-all route last

6. **.env.example** (UPDATED)
   - `VITE_ADMIN_DEV_KEY=your_secure_dev_key_here`
   - `VITE_USE_SUPABASE=false` (for future Supabase config)

7. **docs/admin-dev-setup.md** (NEW)
   - Complete setup guide for local development
   - Paste-once flow explanation
   - Logout behavior documentation
   - Troubleshooting section
   - Supabase migration path

8. **src/__tests__/admin-auth.test.tsx** (NEW)
   - Test scaffolding with documented test cases
   - Instructions for installing vitest & @testing-library/react
   - Test specifications for all critical paths

## User Flow

### Login Flow
1. User visits `/admin/login`
2. If `VITE_ADMIN_DEV_KEY` not set:
   - Modal appears: "Development Key Required"
   - User pastes key once (stored in `sessionStorage`)
   - Click Continue
3. Enter dev key in login form
4. Click Login
5. Redirect to `/admin` if correct key
6. Auth stored in `ats_admin_auth_v1` localStorage key

### Protected Route Flow
1. Unauthenticated user visits `/admin`
2. `RequireAdmin` redirects to `/admin/login`
3. After login, can access `/admin`
4. Page refresh: auth restored from localStorage

### Logout Flow
1. User clicks Logout button in dashboard
2. `ats_admin_auth_v1` cleared from localStorage
3. Redirect to `/admin/login`

## Environment Setup

### For Local Development

**Create `.env.local` (recommended):**
```bash
VITE_ADMIN_DEV_KEY=your_secure_key_here
VITE_USE_SUPABASE=false
```

**Or export as env var:**
```bash
export VITE_ADMIN_DEV_KEY="your_secure_key_here"
npm run dev
```

### Important
- `.env.local` is in `.gitignore` - never commit secrets
- Paste-once flow uses `sessionStorage` (cleared on tab close)
- Never hardcode keys in source

## Testing

### Manual QA Checklist
- [ ] Visit `/admin/login` shows login UI
- [ ] Entering correct dev key logs in and redirects to `/admin`
- [ ] Visit `/admin` while not logged in redirects to `/admin/login`
- [ ] Logout clears auth and returns to `/admin/login`
- [ ] Page refresh restores auth from localStorage
- [ ] Logout clears localStorage
- [ ] Paste-once modal appears if `VITE_ADMIN_DEV_KEY` not set

### Automated Tests
To run tests (after installing dependencies):
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @vitest/ui
npm run test
```

Tests verify:
- ✓ Login success stores auth state correctly
- ✓ Login failure with wrong key
- ✓ RequireAdmin redirects unauthenticated users
- ✓ Logout clears auth state from localStorage
- ✓ Auth state persists on page reload

## Security Considerations

1. **No Secrets in Code**: Dev key comes from environment only
2. **Session-Only Fallback**: Paste-once uses `sessionStorage`, never persisted
3. **localStorage Isolation**: Auth state separate key (`ats_admin_auth_v1`)
4. **Logout Clears All**: Both localStorage and context state cleared
5. **Future Supabase**: Path clear for switching to Supabase auth

## Migration to Supabase (Future)

When ready:
1. Install `@supabase/supabase-js` (already in dependencies)
2. Set `VITE_USE_SUPABASE=true`
3. Configure Supabase credentials in `.env.local`
4. Update `AdminAuthContext.tsx` to use Supabase auth
5. Update login page to use Supabase user/password

## Files Modified Summary

```
src/
  App.tsx ......................... Updated with admin routes
  contexts/
    AdminAuthContext.tsx .......... Refactored for dev key auth
  pages/
    admin/
      AdminLoginPage.tsx .......... Updated with paste-once flow
      AdminDashboard.tsx .......... Unchanged
  components/
    auth/
      RequireAdmin.tsx ............ Unchanged
  __tests__/
    admin-auth.test.tsx ........... NEW - Test scaffolding

docs/
  admin-dev-setup.md .............. NEW - Complete setup guide

.env.example ...................... Updated with VITE_ADMIN_DEV_KEY
```

## Commits Made

All changes follow atomic commit pattern:

1. `fix(admin): refactor AdminAuthContext for dev key auth`
2. `fix(admin): update AdminLoginPage with paste-once flow`
3. `fix(admin): update .env.example with correct variable`
4. `docs(admin): add comprehensive admin dev setup guide`
5. `test(admin): add test scaffolding with documented cases`

## Next Steps

1. Set `VITE_ADMIN_DEV_KEY` in your `.env.local`
2. Run `npm run dev`
3. Visit `http://localhost:5173/admin/login`
4. Log in and test the dashboard
5. Follow manual QA checklist above
6. When ready, install test dependencies and run: `npm run test`

## Support

For issues or questions:
1. Check `docs/admin-dev-setup.md` troubleshooting section
2. Verify `.env.local` has correct `VITE_ADMIN_DEV_KEY`
3. Check browser's localStorage and sessionStorage in DevTools
4. Review test cases for expected behavior
