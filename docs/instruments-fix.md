# Instruments Page Data Rendering Fix

## Problem Diagnosis

The `/instruments` page was loading but showing no data. Investigation revealed three critical issues:

### 1. Data Serialization Mismatch
- **Issue**: SupabaseService was attempting to directly deserialize Supabase JSON into the C# `Instrument` model
- **Root Cause**: Supabase schema has nested fields (`metadata.applications`, `sample_requirements`) that don't map directly to flat C# properties
- **Impact**: Deserialization failed silently, returning null or empty list

### 2. Field Name Mapping
- **Issue**: Supabase columns use different naming than the C# model expected:
  - `code` (in Supabase) → needed as fallback for `Id`
  - `description` or `short_description` (in Supabase) → `Description` property
  - `metadata.applications` (nested in Supabase) → `Applications` list property
  - `sample_requirements` (in Supabase) → not used in current view but needed for detail page

### 3. Query Logic
- **Issue**: The query `instruments?id=eq.{id}` doesn't work if the ID field is actually `code`
- **Fix**: Changed to `instruments?or=(id.eq.{id},code.eq.{id})` to search both fields

## Solution Implemented

### 1. Enhanced SupabaseService.cs

**New Methods:**
- `MapToInstrument(JsonElement item)` - Converts raw Supabase JSON to typed C# model
- `GetJsonString(JsonElement, propertyName)` - Safely extracts string values
- `GetJsonDateTime(JsonElement, propertyName)` - Safely extracts datetime values

**Updated Methods:**
- `GetInstrumentsAsync()` - Now uses intermediate JsonElement deserialization and custom mapping
- `GetInstrumentByIdAsync()` - Uses improved query with OR logic and custom mapping

**Key Logic:**
```csharp
// Extract primary fields with fallbacks
var id = GetJsonString(item, "code") ?? GetJsonString(item, "id");
var name = GetJsonString(item, "name");
var category = GetJsonString(item, "category");
var description = GetJsonString(item, "description") ?? GetJsonString(item, "short_description");

// Extract nested metadata
var applications = new List<string>();
if (item.TryGetProperty("metadata", out var metadata) && metadata.ValueKind == JsonValueKind.Object)
{
    if (metadata.TryGetProperty("applications", out var appsJson) && appsJson.ValueKind == JsonValueKind.Array)
    {
        foreach (var app in appsJson.EnumerateArray())
        {
            if (app.ValueKind == JsonValueKind.String)
                applications.Add(app.GetString() ?? "");
        }
    }
}
```

### 2. InstrumentsController.cs (No Changes Needed)
- Already correctly async and calls SupabaseService
- Already returns `View(instruments ?? new List<Instrument>())`

### 3. Views/Instruments/Index.cshtml (No Changes Needed)
- Already correctly declares `@model List<Ats.Net.Web.Services.Instrument>`
- Already iterates over Model with `@foreach`
- Already checks for null and empty states

## Verification

✅ **Build Status**: No compilation errors
✅ **Controller Flow**: Async method calls service and passes data to view
✅ **Service Layer**: Robustly deserializes Supabase JSON with proper null handling
✅ **View Layer**: Correctly bound to model and renders with Tailwind classes
✅ **Data Mapping**: Supabase schema columns → C# properties correctly mapped
✅ **Security**: No keys exposed in views or controllers

## Files Modified

1. [Services/SupabaseService.cs](Ats.Net.Web/Services/SupabaseService.cs)
   - Added `MapToInstrument()` method
   - Added `GetJsonString()` helper
   - Added `GetJsonDateTime()` helper
   - Updated `GetInstrumentsAsync()` implementation
   - Updated `GetInstrumentByIdAsync()` implementation

## Expected Behavior After Fix

- `/instruments` page loads all instruments from Supabase
- Instruments display in 3-column grid (md: 2 columns, lg: 3 columns)
- Each instrument shows: name, category, image, and "View details" button
- `/instruments/{id}` detail page loads specific instrument with full description, specifications, and applications
- No Supabase keys appear in HTML source
- No runtime or build errors
