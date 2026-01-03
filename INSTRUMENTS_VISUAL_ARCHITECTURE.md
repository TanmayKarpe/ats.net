# 🎨 VISUAL INSTRUMENTS ARCHITECTURE

## Component Hierarchy

```
App
└── Router
    └── Route: /instruments
        └── Instruments.tsx (Page)
            └── InstrumentsSection.tsx (Component) ⭐ FETCHES DATA
                ├── useEffect Hook
                │   └── supabase.from('instruments').select('*')
                │       └── Maps data
                │           └── setItems(mapped)
                │
                └── Grid of InstrumentCard components
                    ├── InstrumentCard 1
                    │   ├── Image
                    │   ├── Name badge
                    │   └── "View details" Link
                    ├── InstrumentCard 2
                    │   ├── Image
                    │   ├── Name badge
                    │   └── "View details" Link
                    └── InstrumentCard N
                        ├── Image
                        ├── Name badge
                        └── "View details" Link

    └── Route: /instruments/:id
        └── InstrumentDetail.tsx (Page)
            ├── Fetches single instrument
            ├── Display specs, pricing
            └── Booking form
```

---

## Data Flow Diagram

```
┌──────────────────────────────────────────────┐
│        Supabase Database (Cloud)             │
│                                              │
│  Table: instruments                          │
│  ├─ id                                       │
│  ├─ code                                     │
│  ├─ name                                     │
│  ├─ category                                 │
│  ├─ description                              │
│  ├─ sample_requirements                      │
│  ├─ metadata (applications)                  │
│  ├─ coordinator_email                        │
│  └─ is_active                                │
└──────────────────────────────────────────────┘
              ↓ (SELECT * query)
┌──────────────────────────────────────────────┐
│   supabase/client.ts                         │
│   (Initializes connection with              │
│    VITE_SUPABASE_URL &                      │
│    VITE_SUPABASE_ANON_KEY)                  │
└──────────────────────────────────────────────┘
              ↓
┌──────────────────────────────────────────────┐
│   InstrumentsSection.tsx                     │
│                                              │
│   useEffect() {                              │
│     const { data } =                         │
│       await supabase                         │
│         .from('instruments')                 │
│         .select('*')                         │
│                                              │
│     // Transform data                        │
│     const mapped = data.map(row => ({        │
│       id: row.code,                          │
│       name: row.name,                        │
│       category: row.category,                │
│       summary: row.description,              │
│       image: matchImage(row.name),           │
│       ...                                    │
│     }))                                      │
│                                              │
│     setItems(mapped)                         │
│   }                                          │
└──────────────────────────────────────────────┘
              ↓ (Renders cards)
┌──────────────────────────────────────────────┐
│   InstrumentCard components                  │
│                                              │
│   [InstrumentCard x N]                       │
│   ├─ Image with hover effect                 │
│   ├─ Name badge                              │
│   └─ "View details" button                   │
└──────────────────────────────────────────────┘
              ↓ (User clicks)
┌──────────────────────────────────────────────┐
│   InstrumentDetail.tsx Page                  │
│   (Shows full specifications)                │
└──────────────────────────────────────────────┘
```

---

## Service Ecosystem

```
                  ┌─────────────────────────┐
                  │   Supabase Database     │
                  └─────────────────────────┘
                              ↑
                  ┌───────────┼───────────┐
                  │           │           │
        ┌─────────▼───┐ ┌──────▼─────┐ ┌─▼────────────┐
        │ instruments │ │departments │ │facilityUpdates
        │   .ts       │ │   .ts      │ │   .ts
        └─────────────┘ └────────────┘ └───────────────┘
                  │           │           │
        ┌─────────▼───┐ ┌──────▼─────┐ ┌─▼────────────┐
        │consultancy  │ │announcement│ │   prices
        │Enquiries.ts │ │   .ts      │ │   .ts
        └─────────────┘ └────────────┘ └───────────────┘
                  │
        ┌─────────▼───────────┐
        │   components.ts     │
        │   storage.ts        │
        └─────────────────────┘

All services use:
supabase/client.ts (connection)
supabase/types.ts (TypeScript definitions)
```

---

## File Organization

```
src/
│
├── pages/
│   ├── Instruments.tsx              ← Main listing page
│   ├── InstrumentDetail.tsx         ← Detail page
│   └── ...other pages
│
├── components/
│   ├── sections/
│   │   └── InstrumentsSection.tsx   ← ⭐ KEY COMPONENT
│   ├── instruments/
│   │   └── InstrumentCard.tsx       ← Card display
│   └── ...other components
│
├── services/
│   ├── instruments.ts               ← ⭐ Database operations
│   ├── departments.ts
│   ├── facilityUpdates.ts
│   ├── consultancyEnquiries.ts
│   ├── announcements.ts
│   ├── prices.ts
│   ├── components.ts
│   └── storage.ts
│
├── integrations/
│   └── supabase/
│       ├── client.ts                ← Supabase setup
│       └── types.ts                 ← Type definitions
│
├── data/
│   └── instruments.ts               ← Static fallback data
│
└── supabase/
    └── client.ts                    ← Re-export
```

---

## InstrumentsSection Code Flow

```
InstrumentsSection Component Mounts
         ↓
[1] Check: Is supabase initialized?
         ↓
      Yes ↓ No
         │  └─→ Show error, setLoading(false), return
         │
[2] Build Supabase Query
    query = supabase.from('instruments').select('*')
         ↓
[3] If featuredOnly prop = true
    Add filter: .eq('is_featured', true)
         ↓
[4] Execute Query
    const { data, error } = await query
         ↓
[5] Error Handling
    if (error) → Log error, setError(message), return
         ↓
[6] Map Data
    const mapped = data.map(row => ({
      id: row.code || row.id,
      name: row.name,
      category: row.category,
      summary: row.description,
      image: matchImage(row.name),
      applications: row.metadata?.applications || [],
      sampleRequirements: row.sample_requirements || [],
      contactEmail: row.coordinator_email || ''
    }))
         ↓
[7] Update State
    setItems(mapped)
         ↓
[8] Render Grid
    Return JSX with:
    - Loading spinner (if loading)
    - Error message (if error)
    - Grid of InstrumentCard components (if data)
         ↓
[9] User Interaction
    Click "View details" → Navigate to /instruments/:id
```

---

## Database Schema (Simplified)

```
┌─────────────────────────────────────┐
│         instruments table           │
├─────────────────────────────────────┤
│ id                    UUID           │  ← Primary key
│ code                  TEXT           │  ← Used as app ID
│ slug                  TEXT           │
│ name                  TEXT           │  ← Instrument name
│ short_description     TEXT           │
│ description           TEXT           │  ← Full description
│ category              TEXT           │  ← Category/department
│ sample_requirements   JSONB          │  ← Array of requirements
│ metadata              JSONB          │  ← Contains applications
│ is_active             BOOLEAN        │
│ is_featured           BOOLEAN        │
│ coordinator_email     TEXT           │
│ created_at            TIMESTAMP      │
│ updated_at            TIMESTAMP      │
└─────────────────────────────────────┘
```

---

## Type Transformation Map

```
Supabase Row
    ↓
InstrumentsSection mapping function
    ↓
App Instrument Type

Mapping:
┌──────────────────┬──────────────────┬────────────────┐
│ Supabase Field   │  Map To          │  App Property  │
├──────────────────┼──────────────────┼────────────────┤
│ code             │ fallback (id)     │ id             │
│ id               │ fallback (code)   │ id             │
│ name             │ direct            │ name           │
│ category         │ direct            │ category       │
│ description      │ direct            │ summary        │
│ short_desc...    │ fallback (desc)   │ summary        │
│ metadata.apps    │ map/fallback []   │ applications   │
│ sample_req...    │ parse/array       │ sampleReqs.    │
│ coordinator_...  │ direct            │ contactEmail   │
│ (matched name)   │ static lookup     │ image          │
└──────────────────┴──────────────────┴────────────────┘
```

---

## State Management Flow

```
Component Initial State
    ├── items: [] (empty array)
    ├── loading: true
    └── error: null

useEffect triggers
    │
    ├── setLoading(true) if starting query
    │
    ├── Query executes
    │
    └── Response received
        ├── If error:
        │   └── setError(error.message)
        │   └── setLoading(false)
        │
        └── If success:
            ├── Transform data
            ├── setItems(mapped)
            ├── setError(null)
            └── setLoading(false)

Component Re-renders
    │
    ├── if loading → Show spinner
    ├── if error → Show error message
    └── if items → Render InstrumentCard grid
```

---

## Responsive Design

```
Mobile (< 768px)
┌─────────────────┐
│  Instrument 1   │
│  [Card Full W]  │
└─────────────────┘
┌─────────────────┐
│  Instrument 2   │
│  [Card Full W]  │
└─────────────────┘

Tablet (768px - 1024px)
┌─────────────┬─────────────┐
│ Instrument1 │ Instrument2 │
│  [Card 50%] │  [Card 50%] │
└─────────────┴─────────────┘

Desktop (> 1024px)
┌──────────┬──────────┬──────────┐
│Instr. 1  │Instr. 2  │Instr. 3  │
│[Card 33%]│[Card 33%]│[Card 33%]│
└──────────┴──────────┴──────────┘
┌──────────┬──────────┬──────────┐
│Instr. 4  │Instr. 5  │Instr. 6  │
│[Card 33%]│[Card 33%]│[Card 33%]│
└──────────┴──────────┴──────────┘
```

---

## Error Handling Flow

```
Query Execution
    ↓
Does supabase exist?
    ├─ No → console.error, show "Data service unavailable"
    │
    └─ Yes → Execute query
         ↓
    Did query have error?
        ├─ Yes → console.error with details
        │        Show error message to user
        │
        └─ No → Proceed with data mapping
```

---

## Performance Considerations

```
Component Lifecycle
    │
    ├─ Mount → useEffect runs once
    │            (due to empty dependency array)
    │
    ├─ Update → No re-fetch unless imageByName changes
    │            (imageByName computed from static data)
    │
    └─ Unmount → Clean up with cancelled flag
                 (prevents state update after unmount)

Memory Management
    ├─ Cleanup function cancels ongoing queries
    ├─ No memory leaks from stale requests
    └─ Image URLs cached in Map
```

---

## Summary Table

| Aspect | Detail |
|--------|--------|
| **Main Data Fetch** | `supabase.from('instruments').select('*')` |
| **Fetch Location** | InstrumentsSection.tsx useEffect |
| **Data Transform** | Map Supabase rows to app Instrument type |
| **Display** | Grid of InstrumentCard components |
| **User Navigation** | Click card → Navigate to detail page |
| **Services Used** | instruments.ts (optional, not used in listing) |
| **Environment Vars** | VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY |
| **Error Handling** | Try/catch, console logging, user messages |
| **Loading State** | Spinner during fetch |
| **Fallback** | Static images from src/data/instruments.ts |

---

This architecture provides a clean, maintainable, and scalable way to fetch and display instruments from Supabase!
