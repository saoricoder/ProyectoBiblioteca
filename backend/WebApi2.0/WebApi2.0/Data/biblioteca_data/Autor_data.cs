using Microsoft.Data.SqlClient;
using WebApi2._0.models.biblioteca;
namespace WebApi2._0.Data.biblioteca_data
{
    public class Autor_data
    {
        private static readonly string baseDatos = "BIBLIOTECA";

        // Insertar Autor
        public static bool InsertarAutor(Autor_models autor)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO Autores (Codigo, Nombre, Apellido) VALUES (@codigo, @nombre, @apellido)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", autor.Codigo);
            comando.Parameters.AddWithValue("@nombre", autor.Nombre);
            comando.Parameters.AddWithValue("@apellido", autor.Apellido);

            try
            {
                return comando.ExecuteNonQuery() > 0;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error al insertar Autor: {e.Message}");
                return false;
            }
        }

        // Consultar todos los Autores
        public static List<Autor_models> ConsultarAutores()
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Autores";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Autor_models> lista = [];

            while (reader.Read())
            {
                lista.Add(new Autor_models()
                {
                    Codigo = reader.GetInt32(0),
                    Nombre = reader.GetString(1),
                    Apellido = reader.GetString(2)
                });
            }
            return lista;
        }

        // Consultar Autor por código
        public static Autor_models? ConsultarAutor(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Autores WHERE Codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();

            return reader.Read() ? new Autor_models()
            {
                Codigo = reader.GetInt32(0),
                Nombre = reader.GetString(1),
                Apellido = reader.GetString(2)
            } : null;
        }

        // Actualizar Autor
        public static bool ActualizarAutor(int codigo, Autor_models autor)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "UPDATE Autores SET Nombre = @nombre, Apellido = @apellido WHERE Codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            comando.Parameters.AddWithValue("@nombre", autor.Nombre);
            comando.Parameters.AddWithValue("@apellido", autor.Apellido);

            return comando.ExecuteNonQuery() > 0;
        }

        // Eliminar Autor
        public static bool EliminarAutor(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM Autores WHERE Codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);

            return comando.ExecuteNonQuery() > 0;
        }
    }

}

