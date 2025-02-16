using Microsoft.AspNetCore.Mvc;
using WebApi3.Data.Biblioteca_data;
using WebApi3.Models.Biblioteca_models;

namespace WebApi3.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class Biblioteca_controllers : Controller
    {

        // GET: api/libros
        [HttpGet("libros")]
        public List<Libros_models> GetLibros()
        {
            return Libros_data.ConsultarLibros();
        }

        // GET: api/libros/5
        [HttpGet("libros/{isbn}")]
        public Libros_models? GetLibro(string isbn)
        {
            return Libros_data.ConsultarLibro(isbn);
        }

        // POST: api/libros
        [HttpPost("libros")]
        public bool PostLibro([FromBody] Libros_models libro)
        {
            return Libros_data.InsertarLibro(libro);
        }

        // PUT: api/libros/5
        [HttpPut("libros/{isbn}")]
        public bool PutLibro(string isbn, [FromBody] Libros_models libro)
        {
            return Libros_data.ActualizarLibro(isbn, libro);
        }

        // DELETE: api/libros/5
        [HttpDelete("libros/{isbn}")]
        public bool DeleteLibro(string isbn)
        {
            return Libros_data.EliminarLibro(isbn);
        }

        // GET: api/autores
        [HttpGet("autores")]
        public List<Autores_models> GetAutores()
        {
            return Autores_data.ConsultarAutores();
        }

        // GET: api/autores/5
        [HttpGet("autores/{codigo}")]
        public Autores_models? GetAutor(int codigo)
        {
            return Autores_data.ConsultarAutor(codigo);
        }

        // POST: api/autores
        [HttpPost("autores")]
        public bool PostAutor([FromBody] Autores_models autor)
        {
            return Autores_data.InsertarAutor(autor);
        }

        // PUT: api/autores/5
        [HttpPut("autores/{codigo}")]
        public bool PutAutor(int codigo, [FromBody] Autores_models autor)
        {
            return Autores_data.ActualizarAutor(codigo, autor);
        }

        // DELETE: api/autores/5
        [HttpDelete("autores/{codigo}")]
        public bool DeleteAutor(int codigo)
        {
            return Autores_data.EliminarAutor(codigo);
        }

        // GET: api/prestamos
        [HttpGet("prestamos")]
        public List<Prestamos_models> GetPrestamos()
        {
            return Prestamos_data.ConsultarPrestamos();
        }

        // GET: api/prestamos/5
        [HttpGet("prestamos/{numero}")]
        public Prestamos_models? GetPrestamo(int numero)
        {
            return Prestamos_data.ConsultarPrestamo(numero);
        }

        // POST: api/prestamos
        [HttpPost("prestamos")]
        public bool PostPrestamo([FromBody] Prestamos_models prestamo)
        {
            return Prestamos_data.InsertarPrestamo(prestamo);
        }

        // PUT: api/prestamos/5
        [HttpPut("prestamos/{numero}")]
        public bool PutPrestamo(int numero, [FromBody] Prestamos_models prestamo)
        {
            return Prestamos_data.ActualizarPrestamo(numero, prestamo);
        }

        // DELETE: api/prestamos/5
        [HttpDelete("prestamos/{numero}")]
        public bool DeletePrestamo(int numero)
        {
            return Prestamos_data.EliminarPrestamo(numero);
        }

        // GET: api/detalleprestamos
        [HttpGet("detalleprestamos")]
        public List<DetallePrestamos_models> GetDetallePrestamos()
        {
            return DetallePrestamos_data.ConsultarDetalles();
        }

        // GET: api/detalleprestamos/5
        [HttpGet("detalleprestamos/{id}")]
        public DetallePrestamos_models? GetDetallePrestamo(int id)
        {
            return DetallePrestamos_data.ConsultarDetalle(id);
        }

        // POST: api/detalleprestamos
        [HttpPost("detalleprestamos")]
        public bool PostDetallePrestamo([FromBody] DetallePrestamos_models detalle)
        {
            return DetallePrestamos_data.InsertarDetalle(detalle);
        }

        // PUT: api/detalleprestamos/5
        [HttpPut("detalleprestamos/{id}")]
        public bool PutDetallePrestamo(int id, [FromBody] DetallePrestamos_models detalle)
        {
            return DetallePrestamos_data.ActualizarDetalle(id, detalle);
        }

        // DELETE: api/detalleprestamos/5
        [HttpDelete("detalleprestamos/{id}")]
        public bool DeleteDetallePrestamo(int id)
        {
            return DetallePrestamos_data.EliminarDetalle(id);
        }
    }
}
