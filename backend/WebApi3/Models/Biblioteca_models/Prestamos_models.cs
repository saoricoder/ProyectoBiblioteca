namespace WebApi3.Models.Biblioteca_models
{
    public class Prestamos_models
    {
        public int Numero { get; set; }
        public DateTime FechaPrestamo { get; set; }
        public string? Descripcion { get; set; }

        public List<DetallePrestamos_models>? Detalles { get; set; }
    }
}
