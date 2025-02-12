namespace WebApi2._0.Data
{
    public class Conexion
    {
        private String user = "saoricoder";
        private String password = "23889";
        private String server = "PONIO-CRK2\\MSSQLSERVER01";
        private String database = "master";
       
        private static readonly string rutaConexion = "Data Source=PONIO-CRK2\\MSSQLSERVER01;Initial Catalog=master;Persist Security Info=True;User ID=saoricoder;Password=23889;Trust Server Certificate=True";
        public static string RutaConexion
        {
            get { return rutaConexion; }
        }
    }
}
