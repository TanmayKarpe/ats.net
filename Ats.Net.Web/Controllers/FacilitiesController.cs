using Ats.Net.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ats.Net.Web.Controllers;

public class FacilitiesController : Controller
{
    private readonly SupabaseService _supabaseService;

    public FacilitiesController(SupabaseService supabaseService)
    {
        _supabaseService = supabaseService;
    }

    [HttpGet("/facilities")]
    public async Task<IActionResult> Index()
    {
        var facilities = await _supabaseService.GetFacilitiesAsync();
        return View(facilities ?? new List<Facility>());
    }

    [HttpGet("/facilities/{id}")]
    public async Task<IActionResult> Detail(string id)
    {
        var facility = await _supabaseService.GetFacilityByIdAsync(id);
        
        if (facility == null)
        {
            return NotFound();
        }
        
        return View(facility);
    }
}
