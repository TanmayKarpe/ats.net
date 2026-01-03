# 📄 Pages Overview

## Instruments.tsx
**Purpose**: Main instruments listing page  
**Size**: 16 lines  
**What it does**:
- Displays page header with "Our Instruments" title
- Renders the InstrumentsSection component
- Simple wrapper component for layout

**Key Components Used**:
- `InstrumentsSection` - Main component that loads and displays instruments

**Typical Flow**:
User navigates to /instruments → This page renders → InstrumentsSection component loads data from Supabase

---

## InstrumentDetail.tsx
**Purpose**: Shows detailed view of a single instrument  
**Size**: 609 lines  
**What it does**:
- Displays full instrument specifications, applications, pricing
- Shows sample requirements and contact information
- Has booking/reservation form
- Links back to instruments list
- Supports collapsible sections for specs and details

**Key Features**:
- Fetches instrument by code/ID from URL params
- Supports booking form with user information
- Email integration for contact
- Fallback to static data if Supabase fails

**Uses**:
- Supabase client to fetch individual instrument
- React Router for navigation
- UI components for dialogs, forms, and content display

---

## How Pages Work Together

```
/instruments (Instruments.tsx)
    ↓
InstrumentsSection loads all instruments
    ↓
User clicks "View details" on card
    ↓
Router navigates to /instruments/:code (InstrumentDetail.tsx)
    ↓
Detail page loads specific instrument data
    ↓
Shows full specs, pricing, booking form
```
