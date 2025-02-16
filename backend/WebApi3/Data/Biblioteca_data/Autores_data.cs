using Microsoft.Data.SqlClient;
using WebApi3.Models.Biblioteca_models;

namespace WebApi3.Data.Biblioteca_data
{
    public class Autores_data
    {
        private static readonly string baseDatos = "BIBLIOTECA";

        // Insertar Autor
        public static bool InsertarAutor(Autores_models autor)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
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
        public static List<Autores_models> ConsultarAutores()
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Autores";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Autores_models> lista = [];

            while (reader.Read())
            {
                lista.Add(new Autores_models()
                {
                    Codigo = reader.GetInt32(0),
                    Nombre = reader.GetString(1),
                    Apellido = reader.GetString(2)
                });
            }
            return lista;
        }

        // Consultar Autor por código
        public static Autores_models? ConsultarAutor(int codigo)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Autores WHERE Codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();

            return reader.Read() ? new Autores_models()
            {
                Codigo = reader.GetInt32(0),
                Nombre = reader.GetString(1),
                Apellido = reader.GetString(2)
            } : null;
        }

        // Actualizar Autor
        public static bool ActualizarAutor(int codigo, Autores_models autor)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
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
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM Autores WHERE Codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);

            return comando.ExecuteNonQuery() > 0;
        }
    }
}
