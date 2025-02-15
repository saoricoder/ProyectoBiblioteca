namespace WebApi2._0.models.biblioteca
{
    public class Prestamo_models
    {

        public int Numero { get; set; }
        public DateTime FechaPrestamo { get; set; }
        public string? Descripcion { get; set; }

        public List<DetallePrestamo_model>?Detalles{get;set;}

    }
}