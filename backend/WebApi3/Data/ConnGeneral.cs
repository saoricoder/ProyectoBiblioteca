using Microsoft.Data.SqlClient;

namespace WebApi3.Data
{
    public class ConnGeneral
    {
        public static SqlConnection ObtenerConexion(string nombreBaseDatos)
        {
            // Aquí definimos los otros parámetros de la conexión
            string servidor = "PONIO-CRK2\\MSSQLSERVER01";  // Cambiar según tu servidor
            string usuario = "saoricoder";                             // Nombre de usuario
            string contrasena = "23889";                     // Contraseña

            // Construir la cadena de conexión con el nombre de la base de datos recibido como parámetro
            string rutaConexion = $"Data Source={servidor};Initial Catalog={nombreBaseDatos};Persist Security Info=True;User ID={usuario};Password={contrasena};Trust Server Certificate=True;";

            // Crear y retornar la conexión utilizando la cadena configurada
            return new SqlConnection(rutaConexion);
        }
    }
}
