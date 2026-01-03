# 🔧 Services Overview - Supabase Database Operations

All services follow the same pattern: They provide functions to interact with Supabase tables.

## instruments.ts ⭐ PRIMARY FOR INSTRUMENTS

**Table**: `instruments`

**Type Definition**:
```typescript
Instrument {
  id?: string
  slug: string
  name: string
  short_description?: string | null
  description?: string | null
  category?: string | null
  sample_requirements?: any
  metadata?: any
  is_active?: boolean
  coordinator_email?: string | null
}
```

**Core Functions**:
- `listInstruments()` - Get all instruments, ordered by creation date
- `getInstrument(id)` - Get single instrument by ID
- `createInstrument(instr)` - Create new instrument (admin only)
- `updateInstrument(id, instr)` - Update instrument (admin only)
- `deleteInstrument(id)` - Delete instrument (admin only)

**Used by**: InstrumentsSection component, InstrumentDetail page

---

## components.ts - Components/Services Management

**Table**: `components`

**Core Functions**:
- `listComponents()` - Get all components
- `listPublicComponents()` - Get only public/active components
- `getComponent(id)` - Get by ID
- `getComponentBySlug(slug)` - Get by slug
- `createComponent()` - Create (admin)
- `updateComponent()` - Update (admin)
- `deleteComponent()` - Delete (admin)

**Use Case**: For managing facility components, equipment, or services

---

## facilityUpdates.ts - Updates Linked to Instruments

**Table**: `facility_updates`

**Type Definition**:
```typescript
FacilityUpdate {
  id: string
  instrument_id: string      // Linked to instruments table
  update_type: 'training' | 'availability' | 'maintenance' | 'highlight'
  title: string
  short_description: string
  detailed_description?: string | null
  is_active: boolean
  created_at: string
}
```

**Core Functions**:
- `getFacilityUpdates(limit?)` - Get active facility updates with instrument details
- `getUpdateTypeBadge(type)` - Get badge styling for different update types

**Used by**: Dashboard, facility status displays

---

## consultancyEnquiries.ts - User Inquiries

**Table**: `consultancy_enquiries`

**Type Definition**:
```typescript
Enquiry {
  id?: string
  department_id?: string | null
  user_name: string
  user_email: string
  message?: string | null
  status?: string
  created_at?: string
  updated_at?: string
}
```

**Core Functions**:
- `createEnquiry(e)` - Submit new inquiry (public)
- `listEnquiries()` - Get all inquiries (admin)
- `getEnquiryById(id)` - Get single inquiry (admin)
- `updateEnquiryStatus(id, status)` - Update status (admin)
- `deleteEnquiry(id)` - Delete inquiry (admin)

**Used by**: Contact/inquiry forms

---

## announcements.ts - System Announcements

**Table**: `announcements`

**Type Definition**:
```typescript
Announcement {
  id?: string
  title: string
  body?: string | null
  start_at?: string | null
  end_at?: string | null
  pinned?: boolean
  is_published?: boolean
}
```

**Core Functions**:
- `listAnnouncements()` - Get all announcements
- `getAnnouncement(id)` - Get by ID
- `createAnnouncement(a)` - Create (admin)
- `updateAnnouncement(id, a)` - Update (admin)
- `deleteAnnouncement(id)` - Delete (admin)

**Used by**: News/announcements sections

---

## departments.ts - Department/Coordinator Info

**Table**: `departments`

**Type Definition**:
```typescript
Department {
  id?: string
  slug: string
  name: string
  description?: string | null
  coordinator_email: string
  active?: boolean
}
```

**Core Functions**:
- `listDepartments()` - Get active departments only
- `getDepartments()` - Alias for listDepartments
- `getDepartmentBySlug(slug)` - Get by slug
- `listAllDepartments()` - Get all, including inactive
- `createDepartment(d)` - Create (admin)
- `updateDepartment(id, d)` - Update (admin)
- `deleteDepartment(id)` - Delete (admin)

**Used by**: Consultancy, coordinator listings

---

## storage.ts - File & Image Uploads

**Purpose**: Handle file uploads to Supabase Storage buckets

**Buckets**:
- `instrument-images` - Public instrument images
- `documents` - Private documents with signed URLs

**Core Functions**:
- `uploadInstrumentImage(file, path)` - Upload image to public bucket
- `getPublicImageUrl(path)` - Get public image URL
- `getSignedDocumentUrl(path, expiresIn)` - Get temporary signed URL for private documents

**Used by**: Image uploads, document downloads

---

## prices.ts - Instrument Pricing

**Table**: `instrument_prices`

**Type Definition**:
```typescript
Price {
  id?: string
  instrument_id: string
  name: string
  price_inr: number
  duration_days?: number | null
  is_active?: boolean
}
```

**Core Functions**:
- `listPrices(instrumentId?)` - Get prices (optional filter by instrument)
- `getPrice(id)` - Get single price
- `createPrice(p)` - Create (admin)
- `updatePrice(id, p)` - Update (admin)
- `deletePrice(id)` - Delete (admin)

**Used by**: Pricing displays, booking forms

---

## Quick Reference

| Service | Table | Purpose |
|---------|-------|---------|
| instruments.ts | instruments | ⭐ Instrument management |
| components.ts | components | Services/components |
| facilityUpdates.ts | facility_updates | Updates linked to instruments |
| consultancyEnquiries.ts | consultancy_enquiries | User inquiries |
| announcements.ts | announcements | System announcements |
| departments.ts | departments | Department info |
| storage.ts | (storage buckets) | File uploads |
| prices.ts | instrument_prices | Pricing data |

All services use the same Supabase client instance and follow consistent error handling patterns.
