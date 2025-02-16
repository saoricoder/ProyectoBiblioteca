using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApi2._0.models.biblioteca;

using System.Collections.Generic;
using WebApi2._0.Data.biblioteca_data;

namespace WebApi2._0.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class BibliotecaController : Controller
    {
        // GET: api/libros
        [HttpGet("libros")]
        public List<Libro_models> GetLibros()
        {
            return Libro_data.ConsultarLibros();
        }

        // GET: api/libros/5
        [HttpGet("libros/{isbn}")]
        public Libro_models? GetLibro(string isbn)
        {
            return Libro_data.ConsultarLibro(isbn);
        }

        // POST: api/libros
        [HttpPost("libros")]
        public bool PostLibro([FromBody] Libro_models libro)
        {
            return Libro_data.InsertarLibro(libro);
        }

        // PUT: api/libros/5
        [HttpPut("libros/{isbn}")]
        public bool PutLibro(string isbn, [FromBody] Libro_models libro)
        {
            return Libro_data.ActualizarLibro(isbn, libro);
        }

        // DELETE: api/libros/5
        [HttpDelete("libros/{isbn}")]
        public bool DeleteLibro(string isbn)
        {
            return Libro_data.EliminarLibro(isbn);
        }

        // GET: api/autores
        [HttpGet("autores")]
        public List<Autor_models> GetAutores()
        {
            return Autor_data.ConsultarAutores();
        }

        // GET: api/autores/5
        [HttpGet("autores/{codigo}")]
        public Autor_models? GetAutor(int codigo)
        {
            return Autor_data.ConsultarAutor(codigo);
        }

        // POST: api/autores
        [HttpPost("autores")]
        public bool PostAutor([FromBody] Autor_models autor)
        {
            return Autor_data.InsertarAutor(autor);
        }

        // PUT: api/autores/5
        [HttpPut("autores/{codigo}")]
        public bool PutAutor(int codigo, [FromBody] Autor_models autor)
        {
            return Autor_data.ActualizarAutor(codigo, autor);
        }

        // DELETE: api/autores/5
        [HttpDelete("autores/{codigo}")]
        public bool DeleteAutor(int codigo)
        {
            return Autor_data.EliminarAutor(codigo);
        }

        // GET: api/prestamos
        [HttpGet("prestamos")]
        public List<Prestamo_models> GetPrestamos()
        {
            return Prestamos_data.ConsultarPrestamos();
        }

        // GET: api/prestamos/5
        [HttpGet("prestamos/{numero}")]
        public Prestamo_models? GetPrestamo(int numero)
        {
            return Prestamos_data.ConsultarPrestamo(numero);
        }

        // POST: api/prestamos
        [HttpPost("prestamos")]
        public bool PostPrestamo([FromBody] Prestamo_models prestamo)
        {
            return Prestamos_data.InsertarPrestamo(prestamo);
        }

        // PUT: api/prestamos/5
        [HttpPut("prestamos/{numero}")]
        public bool PutPrestamo(int numero, [FromBody] Prestamo_models prestamo)
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
        public List<DetallePrestamo_model> GetDetallePrestamos()
        {
            return DetallePrestamos_data.ConsultarDetalles();
        }

        // GET: api/detalleprestamos/5
        [HttpGet("detalleprestamos/{id}")]
        public DetallePrestamo_model? GetDetallePrestamo(int id)
        {
            return DetallePrestamos_data.ConsultarDetalle(id);
        }

        // POST: api/detalleprestamos
        [HttpPost("detalleprestamos")]
        public bool PostDetallePrestamo([FromBody] DetallePrestamo_model detalle)
        {
            return DetallePrestamos_data.InsertarDetalle(detalle);
        }

        // PUT: api/detalleprestamos/5
        [HttpPut("detalleprestamos/{id}")]
        public bool PutDetallePrestamo(int id, [FromBody] DetallePrestamo_model detalle)
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

