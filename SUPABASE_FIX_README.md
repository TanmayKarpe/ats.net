# Supabase Instruments Data Fix

## Root Causes Identified

### 1. Environment Variable Mismatch (FIXED)
- `.env` had: `VITE_SUPABASE_PUBLISHABLE_KEY`
- Client expected: `VITE_SUPABASE_ANON_KEY`
- **Status:** ✅ Corrected

### 2. Schema Column Mismatch (FIXED)
**Issue:** Public query used non-existent columns
- Queried: `code`, `department`, `make`, `model`, `sample `, `applications`, `price_*`, `contact_*`
- Actual schema: `id`, `slug`, `name`, `category`, `description`, `short_description`, `sample_requirements`, `metadata`, `coordinator_email`

**Status:** ✅ Updated to match actual schema

### 3. Invalid ORDER BY Column (FIXED)
- Attempted: `.order('name', { ascending: true })`
- Column `name` may not be indexed or query was failing before order
- **Status:** ✅ Removed order clause temporarily

## Fixes Applied

### 1. Environment Variables ✅
**Files:** `.env`, `.env.local`, `.env.example`
- Renamed `VITE_SUPABASE_PUBLISHABLE_KEY` → `VITE_SUPABASE_ANON_KEY`
- Added correct config to `.env.local`

### 2. Schema Alignment ✅
**Files:**
- `src/components/sections/InstrumentsSection.tsx`
- `src/pages/InstrumentDetail.tsx`

**Mapping corrections:**
- `code` → `slug` (identifier)
- `department` → `category`
- `description` (use as-is, fallback to `short_description`)
- `sample ` → `sample_requirements`
- `applications` → `metadata.applications` (if exists in JSON)
- `contact_email` → `coordinator_email`
- Removed: `make`, `model`, `price_*`, `contact_name`, `contact_phone` (not in schema)

### 3. Enhanced Error Logging ✅
**Files:**
- `src/components/sections/InstrumentsSection.tsx`
- `src/pages/InstrumentDetail.tsx`

Added comprehensive error logging:
```javascript
console.error('Supabase query error:', {
  message: error.message,
  code: error.code,
  details: error.details,
  hint: error.hint,
  full: error
});
```

### 4. Query Simplification ✅
**File:** `src/components/sections/InstrumentsSection.tsx`
- Removed `.order('name', { ascending: true })` temporarily
- Using simple `.select('*')` to isolate issues

## Current Schema (Confirmed)

```typescript
{
  id: string                    // Primary key
  slug: string                  // URL identifier
  name: string                  // Display name
  short_description?: string    // Brief summary
  description?: string          // Full description
  category?: string            // Category/department
  sample_requirements?: any     // Requirements (JSON or string)
  metadata?: any               // JSON field (contains applications, etc.)
  is_active?: boolean          // Visibility flag
  coordinator_email?: string    // Contact email
  created_at?: timestamp       // Creation timestamp
}
```

## Required Actions

### Step 1: Restart Dev Server ⚠️
Environment variables load at build time - **MUST RESTART**:

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 2: Apply RLS Policy
Execute in Supabase Dashboard → SQL Editor:

```sql
-- File: sql/instruments_rls_policy.sql
ALTER TABLE public.instruments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to instruments"
ON public.instruments FOR SELECT TO public USING (true);

GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.instruments TO anon;
```

### Step 3: Verify Console Output
Open browser console and check for:
- ✅ "Successfully loaded X instruments from Supabase"
- ✅ No error messages
- ✅ Instrument cards visible

## Expected Behavior After Fix

### 1. Homepage Instruments Section
- Shows "Loading instruments…" briefly
- Displays grid of instrument cards
- Console: "Successfully loaded X instruments"

### 2. Instrument Detail Page
- Loads data by `slug` (not `code`)
- Shows: name, category, description, applications (if in metadata)
- Contact via `coordinator_email`
- Pricing section shows "Contact for details" (no price fields in schema)

### 3. Console Output (Success)
```
Successfully loaded 6 instruments from Supabase
```

### 4. Console Output (Error - Detailed)
If still failing, console will show:
```javascript
{
  message: "exact error message",
  code: "error_code",
  details: "...",
  hint: "..."
}
```

## Known Limitations

Based on current schema, these features are NOT available:
- ❌ Make/Model information (fields don't exist)
- ❌ Pricing table with internal/external/industry rates (fields don't exist)
- ❌ Contact person name/phone (only email via coordinator_email)
- ❌ Applications list (unless stored in metadata JSON)

**Workaround:** Pricing section shows "Contact for details" for all categories.

## Rollback (if needed)

If issues persist, temporarily use static data:

```typescript
// In InstrumentsSection.tsx
useEffect(() => {
  setItems(staticInstruments);
  setLoading(false);
}, []);
```

## Next Steps (After Successful Load)

1. ✅ Confirm instruments render on homepage
2. ✅ Test detail page navigation
3. ⚠️ Review if schema needs additional columns:
   - `price_internal`, `price_external`, `price_industry`
   - `make`, `model`
   - `contact_name`, `contact_phone`
   - Move `applications` to dedicated column vs. metadata JSON

## Contact / Debug

If instruments still don't load:
1. Check browser console for detailed error object
2. Verify RLS policy applied in Supabase Dashboard
3. Confirm `instruments` table exists and has `is_active = true` rows
4. Check Network tab for actual API request/response
