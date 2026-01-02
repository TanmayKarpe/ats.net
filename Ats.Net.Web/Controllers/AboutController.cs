using Microsoft.AspNetCore.Mvc;

namespace Ats.Net.Web.Controllers;

public class AboutController : Controller
{
    [HttpGet("/about")]
    public IActionResult Index()
    {
        return View();
    }
}
