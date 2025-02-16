namespace WebApi2._0.Data
{
    public class ConexionNoUsado
    {
       
        private static readonly string rutaConexion = "Data Source=PONIO-CRK2\\MSSQLSERVER01;Initial Catalog=master;Persist Security Info=True;User ID=saoricoder;Password=23889;Trust Server Certificate=True";
        public static string RutaConexion
        {
            get { return rutaConexion; }
        }
    }
}
