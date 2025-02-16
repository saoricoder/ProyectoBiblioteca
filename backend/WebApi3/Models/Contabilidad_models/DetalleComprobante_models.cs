namespace WebApi3.Models.Contabilidad_models
{
    public class DetalleComprobante_models
    {
        public int codigo { get; set; }
        public int Numero { get; set; }
        public string? Cuenta { get; set; }
        public float Debe { get; set; }
        public float Haber { get; set; }
    }
}
