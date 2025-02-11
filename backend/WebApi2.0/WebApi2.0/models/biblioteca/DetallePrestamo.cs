namespace WebApi2._0.models.biblioteca;

public class DetallePrestamo{
    public int CondigoLibro { get; set; }
    public int Cantidad { get; set; }
    public DateTime FechaEntrega { get; set; }

    public Libro_models? Libro {get;set;}

}