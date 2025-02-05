using Microsoft.Data.SqlClient;
using WebApi2._0.models;

namespace WebApi2._0.Data
{
    public class TallerData
    {
        public static bool InsertarTaller(Taller Otaller)
        {
            using SqlConnection conexion = new(Conexion.RutaConexion);
            conexion.Open();
            string query = "INSERT INTO taller (codigo,nombre) VALUES (@codigo,@nombre)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", Otaller.Codigo);
            comando.Parameters.AddWithValue("@nombre", Otaller.Nombre);

            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public static List<Taller> ConsultarTalleres()
        {
            using SqlConnection conexion = new(Conexion.RutaConexion);
            conexion.Open();
            string query = "SELECT * FROM taller";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Taller> lista = new();
            while (reader.Read())
            {
                Taller taller = new()
                {
                    Codigo = reader.IsDBNull(0) ? 0 : reader.GetInt32(0), // Default to 0 if null
                    Nombre = reader.IsDBNull(1) ? string.Empty : reader.GetString(1) // Default to empty string if null
                };
                lista.Add(taller);
            }
            return lista;
        }


        public static Taller ConsultarTaller(int codigo)
        {
            using SqlConnection conexion = new(Conexion.RutaConexion);
            conexion.Open();
            string query = "SELECT * FROM taller WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();
            Taller taller = new();
            if (reader.Read())
            {
                taller.Codigo = reader.GetInt32(0);
                taller.Nombre = reader.GetString(1);
            }
            return taller;
        }

        public static bool ActualizarTaller(int codigo, Taller oTaller)
        {
            using SqlConnection conexion = new(Conexion.RutaConexion);
            conexion.Open();
            string query = "UPDATE taller SET nombre = @nombre WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            comando.Parameters.AddWithValue("@nombre", oTaller.Nombre);
            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
        public static bool EliminarTaller(int codigo)
        {
            using SqlConnection conexion = new(Conexion.RutaConexion);
            conexion.Open();
            string query = "DELETE FROM taller WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                return false;
            }
        }
    }
}
