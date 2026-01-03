using Ats.Net.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ats.Net.Web.Controllers;

public class ConsultancyController : Controller
{
    private readonly SupabaseService _supabaseService;

    public ConsultancyController(SupabaseService supabaseService)
    {
        _supabaseService = supabaseService;
    }

    [HttpGet("/consultancy")]
    public async Task<IActionResult> Index()
    {
        var departments = await _supabaseService.GetDepartmentsAsync();
        return View(departments ?? new List<Department>());
    }
}
