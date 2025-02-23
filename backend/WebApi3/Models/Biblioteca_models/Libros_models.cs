namespace WebApi3.Models.Biblioteca_models
{
    public class Libros_models
    {
        public int AutorCodigo { get; set; }
        public int? ISBN { get; set; }
        public string? Titulo { get; set; }

        public decimal ValorPrestamo { get; set; }
        public Autores_models? Autor { get; set; }
    }
}
