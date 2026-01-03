using Ats.Net.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ats.Net.Web.Controllers;

public class ServicesController : Controller
{
    private readonly SupabaseService _supabaseService;

    public ServicesController(SupabaseService supabaseService)
    {
        _supabaseService = supabaseService;
    }

    [HttpGet("/services")]
    public async Task<IActionResult> Index()
    {
        var services = await _supabaseService.GetServicesAsync();
        return View(services ?? new List<Service>());
    }

    [HttpGet("/services/{id}")]
    public async Task<IActionResult> Detail(string id)
    {
        var service = await _supabaseService.GetServiceByIdAsync(id);
        
        if (service == null)
        {
            return NotFound();
        }
        
        return View(service);
    }
}
