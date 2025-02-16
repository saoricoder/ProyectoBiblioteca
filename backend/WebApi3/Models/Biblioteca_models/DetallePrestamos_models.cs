namespace WebApi3.Models.Biblioteca_models
{
    public class DetallePrestamos_models
    {
        public int Id { get; set; }
        public int CodigoLibro { get; set; }
        public int Cantidad { get; set; }
        public DateTime FechaEntrega { get; set; }

        public Libros_models? Libro { get; set; }
    }
}
