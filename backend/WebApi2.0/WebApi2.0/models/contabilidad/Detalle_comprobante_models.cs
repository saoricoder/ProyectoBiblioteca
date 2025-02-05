namespace WebApi2._0.models.contabilidad
{
    public class Detalle_comprobante_models
    {
        public int codigo { get; set; }
        public int Numero { get; set; }
        public string? Cuenta { get; set; }
        public float Debe { get; set; }
        public float Haber { get; set; }
    }
}
