using System.Net.Http.Headers;
using System.Text.Json;

namespace Ats.Net.Web.Services;

public class SupabaseService
{
    private readonly HttpClient _httpClient;
    private readonly string _supabaseUrl;
    private readonly string _anonKey;

    public SupabaseService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _supabaseUrl = configuration["Supabase:Url"] 
            ?? throw new InvalidOperationException("Supabase:Url not configured");
        _anonKey = configuration["Supabase:AnonKey"] 
            ?? throw new InvalidOperationException("Supabase:AnonKey not configured");

        // Configure HttpClient with Supabase headers
        _httpClient.BaseAddress = new Uri($"{_supabaseUrl}/rest/v1/");
        _httpClient.DefaultRequestHeaders.Add("apikey", _anonKey);
        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _anonKey);
    }

    public async Task<List<Instrument>?> GetInstrumentsAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("instruments?select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            var rawData = JsonSerializer.Deserialize<List<JsonElement>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });

            if (rawData == null)
                return null;

            var instruments = new List<Instrument>();
            foreach (var item in rawData)
            {
                var instrument = MapToInstrument(item);
                if (instrument != null)
                    instruments.Add(instrument);
            }

            return instruments;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching instruments: {ex.Message}");
            return null;
        }
    }

    private Instrument? MapToInstrument(JsonElement item)
    {
        try
        {
            // Extract primary fields
            var id = GetJsonString(item, "code") ?? GetJsonString(item, "id");
            var name = GetJsonString(item, "name");
            var category = GetJsonString(item, "category");
            var description = GetJsonString(item, "description") ?? GetJsonString(item, "short_description");

            if (string.IsNullOrEmpty(id) && string.IsNullOrEmpty(name))
                return null;

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

            // Extract sample requirements
            var sampleRequirements = new List<string>();
            if (item.TryGetProperty("sample_requirements", out var samplesJson))
            {
                if (samplesJson.ValueKind == JsonValueKind.Array)
                {
                    foreach (var sample in samplesJson.EnumerateArray())
                    {
                        if (sample.ValueKind == JsonValueKind.String)
                            sampleRequirements.Add(sample.GetString() ?? "");
                    }
                }
                else if (samplesJson.ValueKind == JsonValueKind.String)
                {
                    var val = samplesJson.GetString();
                    if (!string.IsNullOrEmpty(val))
                        sampleRequirements.Add(val);
                }
            }

            return new Instrument
            {
                Id = id,
                Name = name,
                Description = description,
                Category = category,
                ImageUrl = GetJsonString(item, "image_url") ?? GetJsonString(item, "imageUrl"),
                Specifications = new List<string>(), // Not populated from Supabase in current schema
                Applications = applications,
                CreatedAt = GetJsonDateTime(item, "created_at")
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error mapping instrument: {ex.Message}");
            return null;
        }
    }

    private string? GetJsonString(JsonElement element, string propertyName)
    {
        if (element.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.String)
            return value.GetString();
        return null;
    }

    private DateTime? GetJsonDateTime(JsonElement element, string propertyName)
    {
        if (element.TryGetProperty(propertyName, out var value) && value.ValueKind == JsonValueKind.String)
        {
            if (DateTime.TryParse(value.GetString(), out var dt))
                return dt;
        }
        return null;
    }

    public async Task<Instrument?> GetInstrumentByIdAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"instruments?or=(id.eq.{id},code.eq.{id})&select=*&limit=1");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            var instruments = JsonSerializer.Deserialize<List<JsonElement>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            if (instruments == null || instruments.Count == 0)
                return null;

            return MapToInstrument(instruments[0]);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching instrument {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<List<Service>?> GetServicesAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("services?select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Service>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching services: {ex.Message}");
            return null;
        }
    }

    public async Task<Service?> GetServiceByIdAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"services?id=eq.{id}&select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            var services = JsonSerializer.Deserialize<List<Service>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            return services?.FirstOrDefault();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching service {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<List<Facility>?> GetFacilitiesAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("facilities?select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Facility>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching facilities: {ex.Message}");
            return null;
        }
    }

    public async Task<Facility?> GetFacilityByIdAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"facilities?id=eq.{id}&select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            var facilities = JsonSerializer.Deserialize<List<Facility>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            return facilities?.FirstOrDefault();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching facility {id}: {ex.Message}");
            return null;
        }
    }

    public async Task<List<Department>?> GetDepartmentsAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("departments?select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Department>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching departments: {ex.Message}");
            return null;
        }
    }

    public async Task<Department?> GetDepartmentBySlugAsync(string slug)
    {
        try
        {
            var response = await _httpClient.GetAsync($"departments?slug=eq.{slug}&select=*");
            response.EnsureSuccessStatusCode();
            
            var json = await response.Content.ReadAsStringAsync();
            var departments = JsonSerializer.Deserialize<List<Department>>(json, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            });
            
            return departments?.FirstOrDefault();
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error fetching department {slug}: {ex.Message}");
            return null;
        }
    }
}

// Model classes matching Supabase schema
public class Instrument
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Category { get; set; }
    public List<string>? Specifications { get; set; }
    public List<string>? Applications { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class Service
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public string? Icon { get; set; }
    public List<string>? Features { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class Facility
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? Location { get; set; }
    public List<string>? Features { get; set; }
    public DateTime? CreatedAt { get; set; }
}

public class Department
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public string? Slug { get; set; }
    public string? Description { get; set; }
    public string? CoordinatorEmail { get; set; }
    public DateTime? CreatedAt { get; set; }
}
