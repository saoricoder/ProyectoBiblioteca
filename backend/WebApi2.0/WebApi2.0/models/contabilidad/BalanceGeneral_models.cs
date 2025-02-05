namespace WebApi2._0.models.contabilidad
{
    public class BalanceGeneral_models
    {
        public List<CuentaSaldo_models> Activos { get; set; } = new List<CuentaSaldo_models>();
        public List<CuentaSaldo_models> Pasivos { get; set; } = new List<CuentaSaldo_models>();
        public List<CuentaSaldo_models> Capital { get; set; } = new List<CuentaSaldo_models>();
    }
}
