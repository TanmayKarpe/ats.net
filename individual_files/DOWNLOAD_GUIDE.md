# Individual Files Download Guide

All files related to the Instruments feature and Supabase integration are organized in this directory.

## 📂 Directory Structure

```
individual_files/
├── pages/                          # Page components
│   ├── Instruments.tsx             # Main instruments listing page
│   └── InstrumentDetail.tsx        # Single instrument details page
│
├── components/                     # UI Components
│   ├── InstrumentsSection.tsx      # Main section with Supabase data loading ⭐
│   └── InstrumentCard.tsx          # Individual card component
│
├── services/                       # Supabase database services (8 files)
│   ├── instruments.ts              # Instrument table operations ⭐ MAIN
│   ├── components.ts               # Components/services table
│   ├── facilityUpdates.ts          # Facility updates linked to instruments
│   ├── consultancyEnquiries.ts     # User inquiry submissions
│   ├── announcements.ts            # System announcements
│   ├── departments.ts              # Department/coordinator info
│   ├── storage.ts                  # File and image uploads
│   └── prices.ts                   # Instrument pricing data
│
└── integrations/                   # Supabase integration files
    └── supabase/
        ├── client.ts               # Client initialization
        └── types.ts                # TypeScript type definitions

```

## 🔑 Key Files to Focus On

### For Fetching Instruments:
1. **InstrumentsSection.tsx** - Where the magic happens (fetches from Supabase)
2. **instruments.ts** (service) - Database functions for instruments table
3. **supabase/client.ts** - Client connection setup

### For Understanding Data Flow:
1. **Instruments.tsx** (page) - Entry point
2. **InstrumentCard.tsx** - Display component
3. **InstrumentDetail.tsx** (page) - Details view

### For Complete Supabase Integration:
- All 8 files in `services/` folder
- Both files in `integrations/supabase/` folder

## 📥 How to Download

Each file is a complete, standalone copy that you can directly download from the VS Code file explorer on the left sidebar under `individual_files/`.

Navigate to the appropriate folder and right-click any file to download it.

## 📊 File Sizes (Approximate)

| File | Size | Priority |
|------|------|----------|
| InstrumentsSection.tsx | 135 lines | ⭐⭐⭐ Critical |
| instruments.ts | 53 lines | ⭐⭐⭐ Critical |
| supabase/client.ts | 25 lines | ⭐⭐⭐ Critical |
| Instruments.tsx | 16 lines | ⭐⭐ Important |
| InstrumentCard.tsx | 45 lines | ⭐⭐ Important |
| departments.ts | 48 lines | ⭐ Useful |
| components.ts | 56 lines | ⭐ Useful |
| prices.ts | 40 lines | ⭐ Useful |
| storage.ts | 45 lines | ⭐ Useful |
| facilityUpdates.ts | 70 lines | ⭐ Useful |
| consultancyEnquiries.ts | 56 lines | ⭐ Useful |
| announcements.ts | 40 lines | ⭐ Useful |
| supabase/types.ts | 156 lines | 📚 Reference |
| InstrumentDetail.tsx | N/A | ⭐⭐ Important |

## 🎯 Quick Start Path

If you only need to understand how instruments are fetched:

1. Read `Instruments.tsx` - Page structure
2. Read `InstrumentsSection.tsx` - Main data fetching component
3. Read `instruments.ts` (service) - Database operations
4. Read `supabase/client.ts` - Connection setup

That's the core flow for instruments!

## 🔗 Dependencies Between Files

```
Instruments.tsx (page)
    └─> InstrumentsSection.tsx
            └─> InstrumentCard.tsx
            └─> supabase (client)
                └─> supabase/client.ts
                └─> supabase/types.ts

instruments.ts (service)
    └─> supabase/client.ts
```

## 💡 Notes

- All services use the same Supabase client instance
- Type definitions are auto-generated (don't edit supabase/types.ts)
- Environment variables needed: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Static fallback data in `src/data/instruments.ts` (not included here as it's just data)
