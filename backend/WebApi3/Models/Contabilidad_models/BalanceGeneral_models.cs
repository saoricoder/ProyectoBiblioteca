namespace WebApi3.Models.Contabilidad_models
{
    public class BalanceGeneral_models
    {
        public List<CuentaSaldo_models> Activos { get; set; } = new List<CuentaSaldo_models>();
        public List<CuentaSaldo_models> Pasivos { get; set; } = new List<CuentaSaldo_models>();
        public List<CuentaSaldo_models> Capital { get; set; } = new List<CuentaSaldo_models>();
    }
}
