using Microsoft.AspNetCore.Mvc;
using WebApi2._0.Data;
using WebApi2._0.models;

namespace WebApi2._0.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class TallerController : ControllerBase
    {
        // GET: api/<TallerController>
        [HttpGet]
        public List<Taller> Get()
        {
            return TallerData.ConsultarTalleres();
        }

        // GET api/<TallerController>/5
        [HttpGet("{id}")]
        public Taller Get(int id)
        {
            return TallerData.ConsultarTaller(id);
        }

        // POST api/<TallerController>
        [HttpPost]
        public bool Post([FromBody] Taller Otaller)
        {
            return TallerData.InsertarTaller(Otaller);
        }

        // PUT api/<TallerController>/5
        [HttpPut("{id}")]
        public bool Put(int id, [FromBody] Taller oTaller)
        {
            return TallerData.ActualizarTaller(id, oTaller);
        }

        // DELETE api/<TallerController>/5
        [HttpDelete("{id}")]
        public bool Delete(int id)
        {
            return TallerData.EliminarTaller(id);
        }
    }
}
