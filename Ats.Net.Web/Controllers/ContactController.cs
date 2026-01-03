using Microsoft.AspNetCore.Mvc;

namespace Ats.Net.Web.Controllers;

public class ContactController : Controller
{
    [HttpGet("/contact")]
    public IActionResult Index()
    {
        return View();
    }
}
