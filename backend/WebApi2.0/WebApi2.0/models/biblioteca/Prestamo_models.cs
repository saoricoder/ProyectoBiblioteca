namespace WebApi2._0.models.biblioteca
{
    public class Prestamo_models
    {
        public int Numero { get; set; }
        public DateOnly FechaPres { get; set; }
        public string? Descripcion { get; set; }
        public string? ISBN { get; set; }

        public int Cantidad { get; set; }

        public DateOnly FechEntr { get; set; }

    }
}