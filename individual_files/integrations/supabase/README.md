# 🔌 Supabase Integration Overview

## client.ts - Connection Setup

**Purpose**: Initialize and export the Supabase client instance

**What it does**:
1. Reads environment variables:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Anonymous API key
2. Creates Supabase client instance with configuration:
   - `storage: localStorage` - Persists auth sessions in browser
   - `persistSession: true` - Keeps user logged in
   - `autoRefreshToken: true` - Auto-refreshes expired tokens
3. Exports `supabase` instance for use throughout app
4. Shows warning if environment variables missing

**Import in other files**:
```typescript
import { supabase } from '@/supabase/client'
// OR
import { supabase } from '@/integrations/supabase/client'
```

**Note**: This file is auto-generated. Don't edit it directly.

---

## types.ts - TypeScript Definitions

**Purpose**: Provides TypeScript types for your Supabase database schema

**What it contains**:
- `Database` type - Main database type definition
- `Tables<T>` - Type for table rows
- `TablesInsert<T>` - Type for inserting new rows
- `TablesUpdate<T>` - Type for updating rows
- `Enums<T>` - Type for database enums
- `CompositeTypes<T>` - Type for composite database types
- `Constants` - Database constants

**Why it's important**:
- Provides IDE autocomplete when writing queries
- Catches type errors at compile time
- Ensures queries match database schema

**Example Usage**:
```typescript
import type { Tables } from '@/integrations/supabase/types'

// Get type for instruments table
type Instrument = Tables<'instruments'>

// Get type for inserting into instruments
type NewInstrument = TablesInsert<'instruments'>
```

**Note**: This file is auto-generated. Don't edit it directly.

---

## How Client & Types Work Together

```
Supabase Database (in cloud)
    ↓
types.ts (defines schema)
    ↓
client.ts (connects and initializes)
    ↓
Services (use client to query)
    ↓
Components (call service functions)
    ↓
UI displays data
```

## Complete Flow for Instruments

```
1. App loads
   ↓
2. client.ts initializes Supabase with credentials
   ↓
3. InstrumentsSection component mounts
   ↓
4. useEffect calls supabase.from('instruments').select('*')
   ↓
5. Query goes to Supabase server
   ↓
6. Data returns and gets mapped to Instrument type
   ↓
7. Components re-render with data
   ↓
8. User sees instruments on page
```

## Environment Setup Required

Create a `.env.local` file in project root:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Get these from your Supabase project settings.

---

## Key Configuration Details

**Auth Storage**: localStorage
- Keeps user authenticated across page reloads
- Auto-recovers session on app restart

**Auto Token Refresh**: Enabled
- Tokens automatically refresh before expiring
- Prevents "unauthorized" errors mid-session

**Fallback**: If environment variables missing
- Client remains null
- Warning logged to console
- App functions without Supabase (uses static data)
