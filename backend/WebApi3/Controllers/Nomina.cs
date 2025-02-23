using Microsoft.AspNetCore.Mvc;

namespace WebApi3.Controllers
{
    public class Nomina : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
