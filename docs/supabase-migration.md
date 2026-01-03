# Supabase Server-Side Migration

## Overview
Supabase credentials have been migrated from client-side environment variables to server-side C# code only. **No Supabase keys are exposed in HTML, JavaScript, or Razor views.**

## Security Implementation

### 1. Configuration (appsettings.json)
- Added `Supabase` section with `Url` and `AnonKey`
- Values migrated from `.env` file (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY)
- Configuration is server-side only, never sent to client

### 2. SupabaseService (Services/SupabaseService.cs)
- C# service using HttpClient to interact with Supabase REST API
- Reads configuration from IConfiguration (injected)
- Configures HttpClient with proper authentication headers
- Methods:
  - `GetInstrumentsAsync()` - Fetch all instruments
  - `GetInstrumentByIdAsync(id)` - Fetch single instrument
  - `GetServicesAsync()` - Fetch all services
  - `GetServiceByIdAsync(id)` - Fetch single service
  - `GetFacilitiesAsync()` - Fetch all facilities
  - `GetFacilityByIdAsync(id)` - Fetch single facility

### 3. Service Registration (Program.cs)
- Registered with `builder.Services.AddHttpClient<SupabaseService>()`
- Scoped lifetime - one instance per HTTP request
- HttpClient automatically configured and injected

### 4. Controllers
- **InstrumentsController**: Injects SupabaseService, fetches data server-side
- **ServicesController**: Injects SupabaseService, fetches data server-side
- **FacilitiesController**: Injects SupabaseService, fetches data server-side

### 5. Views (Razor)
- Views receive **only data models** from controllers
- **No API calls, no keys, no Supabase URLs in client code**
- Pure server-side rendering with data passed via ViewModels

## Data Flow
```
Browser Request 
  → Controller (inject SupabaseService)
    → SupabaseService.GetXxxAsync() 
      → HttpClient with Bearer token (server-side only)
        → Supabase REST API
      ← JSON response
    ← Typed model
  ← View(model) 
← Rendered HTML (no keys)
```

## Security Verification
1. **appsettings.json** - Server-side config file, never sent to browser
2. **Services/SupabaseService.cs** - C# code compiled into assembly, not accessible from client
3. **Controllers** - Server-side C#, execute before rendering
4. **Views** - Receive only data models, no configuration or keys
5. **HTML Source** - Contains zero references to Supabase URL or keys

## Model Classes
Defined in SupabaseService.cs:
- `Instrument` - Represents instrument data from Supabase
- `Service` - Represents service data from Supabase
- `Facility` - Represents facility data from Supabase

All models include nullable properties to handle missing data gracefully.

## Error Handling
- Try-catch blocks in all service methods
- Returns `null` on failure (controllers handle gracefully)
- Console logging for debugging (can be upgraded to ILogger)
- Controllers return `NotFound()` for missing entities

## Future Enhancements
- Add ILogger for proper structured logging
- Implement caching (MemoryCache or Redis) for performance
- Add retry policies using Polly
- Implement more granular error handling and user-friendly error pages
