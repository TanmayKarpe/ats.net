using Ats.Net.Web.Services;
using Microsoft.AspNetCore.Mvc;

namespace Ats.Net.Web.Controllers;

public class InstrumentsController : Controller
{
    private readonly SupabaseService _supabaseService;

    public InstrumentsController(SupabaseService supabaseService)
    {
        _supabaseService = supabaseService;
    }

    [HttpGet("/instruments")]
    public async Task<IActionResult> Index()
    {
        var instruments = await _supabaseService.GetInstrumentsAsync();
        return View(instruments ?? new List<Instrument>());
    }

    [HttpGet("/instruments/{id}")]
    public async Task<IActionResult> Detail(string id)
    {
        var instrument = await _supabaseService.GetInstrumentByIdAsync(id);
        
        if (instrument == null)
        {
            return NotFound();
        }
        
        return View(instrument);
    }
}
