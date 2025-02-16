namespace WebApi3.Models.Contabilidad_models
{
    public class EstadoResultado_models
    {
        public List<CuentaSaldo_models>? Ingresos { get; set; }
        public List<CuentaSaldo_models>? Egresos { get; set; }
        public List<CuentaSaldo_models>? Utilidad { get; set; }
    }
}
