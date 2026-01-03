# Instruments Data Flow & Component Architecture

## Overview
The instruments page fetches instrument data from Supabase database. Here's a complete breakdown of all pages and Supabase services involved.

---

## 📄 PAGES INVOLVED IN INSTRUMENTS FLOW

### 1. **Instruments Page** (`src/pages/Instruments.tsx`)
- **Purpose**: Main entry point for the instruments page
- **What it does**: 
  - Displays page header with title "Our Instruments"
  - Renders the `<InstrumentsSection />` component
  - Acts as a wrapper/layout container
- **Size**: Very small (16 lines)
- **Dependencies**: InstrumentsSection component

### 2. **Instrument Detail Page** (`src/pages/InstrumentDetail.tsx`)
- **Purpose**: Shows detailed information for a single instrument
- **What it does**: 
  - Displays full specifications, applications, pricing
  - Shows sample requirements and contact information
  - Links back to instruments list
- **Dependencies**: Uses instrument data by ID

---

## 🧩 COMPONENTS INVOLVED

### 1. **InstrumentsSection** (`src/components/sections/InstrumentsSection.tsx`)
- **Purpose**: Core component that loads and displays all instruments
- **Size**: 135 lines
- **Key Features**:
  - **Fetches data directly from Supabase** using `supabase.from('instruments').select('*')`
  - Handles loading and error states
  - Maps Supabase data to Instrument type format
  - Provides fallback images from static data
  - Supports `featuredOnly` filter parameter
  - Handles featured instruments display
- **Data Mapping**: 
  - Converts Supabase rows to Instrument objects
  - Matches instrument names with images from static data
  - Extracts: code/id, name, category, description, applications, sample requirements, coordinator email
- **Key Methods**:
  - `useEffect` hook to load data on mount
  - Maps metadata fields (applications, sample requirements)

### 2. **InstrumentCard** (`src/components/instruments/InstrumentCard.tsx`)
- **Purpose**: Displays individual instrument in a card format
- **Size**: ~45 lines
- **What it does**:
  - Renders instrument image, name, and category badge
  - Shows "View details" button linking to instrument detail page
  - Implements hover animations
- **Props**: Accepts `Instrument` object
- **Uses**: React Router Link for navigation

---

## 📊 SUPABASE INTEGRATION FILES

### 1. **Supabase Client** (`src/integrations/supabase/client.ts`)
- **Purpose**: Initializes Supabase connection
- **Size**: ~25 lines
- **What it does**:
  - Creates Supabase client instance with API credentials
  - Uses environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
  - Enables session persistence in localStorage
  - Auto-refreshes auth tokens
  - Provides fallback if environment variables missing
- **Exports**: `supabase` instance for use throughout app

### 2. **Supabase Types** (`src/integrations/supabase/types.ts`)
- **Purpose**: TypeScript type definitions for database schema
- **Size**: ~156 lines
- **What it does**:
  - Defines Database type structure
  - Provides type-safe access to tables and columns
  - Auto-generated (do not edit directly)
  - Enables IDE autocomplete for database queries

---

## 🔧 SUPABASE SERVICE FILES

All located in `src/services/`

### 1. **instruments.ts** (MAIN FOR INSTRUMENTS)
- **Purpose**: Database operations for instruments table
- **Size**: ~53 lines
- **Core Functions**:
  ```typescript
  listInstruments() - Get all instruments
  getInstrument(id) - Get single instrument by ID
  createInstrument(instr) - Create new instrument (admin)
  updateInstrument(id, instr) - Update instrument (admin)
  deleteInstrument(id) - Delete instrument (admin)
  ```
- **Type Definition**:
  ```typescript
  id, slug, name, short_description, description, category,
  sample_requirements, metadata, is_active, coordinator_email
  ```

### 2. **components.ts** (RELATED TO INSTRUMENTS)
- **Purpose**: Database operations for components/services table
- **Size**: ~56 lines
- **Core Functions**:
  ```typescript
  listComponents() - Get all components
  listPublicComponents() - Get public components only
  getComponent(id) - Get by ID
  getComponentBySlug(slug) - Get by slug
  createComponent, updateComponent, deleteComponent
  ```
- **Use Case**: May be related to facility components/services

### 3. **facilityUpdates.ts** (RELATED TO INSTRUMENTS)
- **Purpose**: Facility updates linked to instruments
- **Size**: ~70 lines
- **Key Function**:
  ```typescript
  getFacilityUpdates(limit) - Get active facility updates with instrument details
  getUpdateTypeBadge(type) - Get badge styling for update types
  ```
- **Types of Updates**: training, availability, maintenance, highlight
- **Relation**: Each update is linked to an instrument_id

### 4. **consultancyEnquiries.ts** (USER INQUIRIES)
- **Purpose**: Handle consultancy/inquiry submissions
- **Size**: ~56 lines
- **Core Functions**:
  ```typescript
  createEnquiry(e) - Submit new inquiry
  listEnquiries() - Get all inquiries (admin)
  getEnquiryById(id) - Get single inquiry
  updateEnquiryStatus(id, status) - Update status (admin)
  deleteEnquiry(id) - Delete inquiry (admin)
  ```
- **Fields**: user_name, user_email, message, department_id, status

### 5. **announcements.ts** (SYSTEM ANNOUNCEMENTS)
- **Purpose**: Manage system announcements/news
- **Size**: ~40 lines
- **Core Functions**:
  ```typescript
  listAnnouncements() - Get all announcements
  getAnnouncement(id) - Get by ID
  createAnnouncement(a) - Create new
  updateAnnouncement(id, a) - Update
  deleteAnnouncement(id) - Delete
  ```
- **Fields**: title, body, start_at, end_at, pinned, is_published

### 6. **departments.ts** (DEPARTMENT INFO)
- **Purpose**: Manage departments/coordinators
- **Size**: ~48 lines
- **Core Functions**:
  ```typescript
  listDepartments() - Get active departments
  getDepartmentBySlug(slug) - Get by slug
  listAllDepartments() - Get all including inactive
  createDepartment, updateDepartment, deleteDepartment
  ```
- **Fields**: id, slug, name, description, coordinator_email, active

### 7. **storage.ts** (FILE/IMAGE STORAGE)
- **Purpose**: Handle file uploads to Supabase storage
- **Size**: ~45 lines
- **Core Functions**:
  ```typescript
  uploadInstrumentImage(file, path) - Upload instrument images
  getPublicImageUrl(path) - Get public image URL
  getSignedDocumentUrl(path, expiresIn) - Get private document URL
  ```
- **Buckets**:
  - `instrument-images` - Public instrument images
  - `documents` - Private documents with signed URLs

### 8. **prices.ts** (PRICING DATA)
- **Purpose**: Manage instrument pricing
- **Size**: ~40 lines
- **Core Functions**:
  ```typescript
  listPrices(instrumentId) - Get prices (optional filter by instrument)
  getPrice(id) - Get single price
  createPrice, updatePrice, deletePrice
  ```
- **Fields**: id, instrument_id, name, price_inr, duration_days, is_active

---

## 🔄 DATA FLOW DIAGRAM

```
User visits /instruments
    ↓
InstrumentsPage component renders
    ↓
InstrumentsSection component mounts
    ↓
useEffect hook triggers
    ↓
Supabase client initialized (src/integrations/supabase/client.ts)
    ↓
Query: supabase.from('instruments').select('*')
    ↓
Data returned with fields: code, name, category, description, 
metadata (applications), sample_requirements, coordinator_email
    ↓
Data mapped to Instrument type format
    ↓
Static images matched by name
    ↓
State updated with mapped data
    ↓
InstrumentCard components rendered in grid
    ↓
User clicks "View details"
    ↓
Router navigates to InstrumentDetail page
    ↓
Shows full instrument specifications
```

---

## 📋 STATIC DATA FALLBACK

### **instruments.ts** (`src/data/instruments.ts`)
- **Purpose**: Fallback static instrument data
- **Size**: 165 lines
- **Contains**: 6 instruments with full details (FE-SEM, FTIR, XRD, UV-Vis, GC-MS, NMR)
- **Usage**: 
  - Provides images for Supabase instruments
  - Fallback if Supabase fails
  - Used for matching and enriching database data

---

## 📁 ENVIRONMENT VARIABLES REQUIRED

```
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

---

## 🎯 QUICK SUMMARY

| Component | Purpose | Size |
|-----------|---------|------|
| **Instruments.tsx** | Main page | 16 lines |
| **InstrumentsSection.tsx** | Loads & displays instruments | 135 lines |
| **InstrumentCard.tsx** | Card component | 45 lines |
| **instruments.ts (service)** | DB operations for instruments | 53 lines |
| **supabase/client.ts** | Client initialization | 25 lines |
| **supabase/types.ts** | Type definitions | 156 lines |

## 📦 Related Supabase Services (8 total)
1. `instruments.ts` - Instrument data ⭐ MAIN
2. `components.ts` - Components/services
3. `facilityUpdates.ts` - Updates linked to instruments
4. `consultancyEnquiries.ts` - User inquiries
5. `announcements.ts` - System announcements
6. `departments.ts` - Department info
7. `storage.ts` - File/image uploads
8. `prices.ts` - Pricing information
