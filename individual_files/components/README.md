# 🧩 Components Overview

## InstrumentsSection.tsx ⭐ MAIN COMPONENT
**Purpose**: Core component that fetches and displays all instruments  
**Size**: 135 lines  
**How it works**:
1. On component mount, useEffect hook runs
2. Initializes Supabase client
3. Queries: `supabase.from('instruments').select('*')`
4. Maps Supabase data to Instrument type format
5. Matches images with static data by instrument name
6. Renders InstrumentCard components in a grid

**Key Features**:
- **Real Supabase Integration** ✅ - Actually fetches from database
- **Loading States** - Shows spinner while loading
- **Error Handling** - Displays error messages if query fails
- **Featured Filter** - Can show only featured instruments via prop
- **Image Fallback** - Uses static images if Supabase doesn't have them
- **Responsive Grid** - Works on mobile, tablet, desktop

**Data Mapping**:
- Supabase field `code` → Instrument `id`
- Supabase field `name` → Instrument `name`
- Supabase field `category` → Instrument `category`
- Supabase field `description/short_description` → Instrument `summary`
- Supabase field `metadata.applications` → Instrument `applications`
- Supabase field `sample_requirements` → Instrument `sampleRequirements`
- Supabase field `coordinator_email` → Instrument `contactEmail`

**Props**:
- `featuredOnly?: boolean` - Show only featured instruments (default: false)

---

## InstrumentCard.tsx
**Purpose**: Individual instrument card component  
**Size**: 45 lines  
**What it does**:
- Renders a card with instrument image, name, and category badge
- Shows "View details" button
- Links to detail page using React Router
- Implements hover animations on image

**Props**:
- `instrument: Instrument` - The instrument data to display

**Features**:
- Image overlay with gradient effect
- Category badge in top-left
- Smooth hover animation on image
- Responsive card layout
- Clean, modern design

---

## How Components Work Together

```
Page: Instruments.tsx
    ↓
Component: InstrumentsSection.tsx
    ├─ Loads data from Supabase
    ├─ Maps data to Instrument type
    └─ Renders multiple InstrumentCard components
        ↓
        Component: InstrumentCard.tsx
            ├─ Displays image with animation
            ├─ Shows name and badge
            └─ Links to detail page
```

**Data Flow**:
```
Supabase Database
    ↓
InstrumentsSection useEffect
    ↓
Supabase query execution
    ↓
Data mapping/transformation
    ↓
State update (setItems)
    ↓
Component re-render with new data
    ↓
InstrumentCard components created for each item
    ↓
User sees cards on page
```
