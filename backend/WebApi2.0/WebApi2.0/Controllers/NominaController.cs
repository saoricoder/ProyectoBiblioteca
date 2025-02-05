using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi2._0.Controllers
{
    public class NominaController : Controller
    {
        // GET: NominaController
        public ActionResult Index()
        {
            return View();
        }

        // GET: NominaController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: NominaController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: NominaController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: NominaController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: NominaController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: NominaController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: NominaController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
