namespace WebApi2._0.models.biblioteca;

public class DetallePrestamo_model{

    public int id { get; set; }
    public int CodigoLibro { get; set; }
    public int Cantidad { get; set; }
    public DateTime FechaEntrega { get; set; }

    public Libro_models? Libro {get;set;}

}