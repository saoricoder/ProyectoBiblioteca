namespace WebApi2._0.models.biblioteca
{
    public class Libro_models
    {
        public int AutorCodigo { get; set; }
        public string? ISBN { get; set; }
        public string? Titulo { get; set; }

        public decimal ValorPrestamo { get; set; }
        public Autor_models? Autor{get;set;}

    }
}