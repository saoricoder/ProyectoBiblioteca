using System.Data;
using Microsoft.Data.SqlClient;
using WebApi3.Models.Biblioteca_models;
using WebApi3.Models.Contabilidad_models;

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

            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception)
            {
                return false;
            }
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

        //Buscar Autor
        public static List<Autores_models>? BuscarAutor(int? codigo = null, string? nombre = null, string? apellido = null)
        {
            try
            {
                using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
                conexion.Open();

                string query = "SELECT codigo AS Codigo, nombre AS Nombre, apellido AS apellido FROM autores WHERE 1=1";

                if (codigo.HasValue)
                {
                    query += " AND codigo = @codigo";
                }

                if (!string.IsNullOrEmpty(nombre))
                {
                    query += " AND nombre LIKE @nombre";
                }

                if (!string.IsNullOrEmpty(apellido))
                {
                    query += " AND apellido LIKE @apellido";
                }

                using SqlCommand comando = new(query, conexion);

                if (codigo.HasValue)
                {
                    comando.Parameters.Add(new SqlParameter("@codigo", SqlDbType.Int) { Value = codigo.Value });
                }

                if (!string.IsNullOrEmpty(nombre))
                {
                    comando.Parameters.Add(new SqlParameter("@nombre", SqlDbType.NVarChar) { Value = $"%{nombre}%" });
                }

                if (!string.IsNullOrEmpty(apellido))
                {
                    comando.Parameters.Add(new SqlParameter("@apellido", SqlDbType.NVarChar) { Value = $"%{apellido}%" });
                }

                using SqlDataReader reader = comando.ExecuteReader();
                List<Autores_models> lista = [];

                while (reader.Read())
                {
                    Autores_models autores = new()
                    {
                        Codigo = reader.GetInt32(reader.GetOrdinal("Codigo")),
                        Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? string.Empty : reader.GetString(reader.GetOrdinal("Nombre")),
                        Apellido = reader.IsDBNull(reader.GetOrdinal("Apellido")) ? string.Empty : reader.GetString(reader.GetOrdinal("Apellido"))
                    };

                    lista.Add(autores);
                }

                return lista; // Retorna null si no se encuentran resultados
            }
            catch (SqlException ex)
            {
                throw new Exception("Error en la base de datos: " + ex.Message, ex);
            }
            catch (Exception ex)
            {
                throw new Exception("Error general: " + ex.Message, ex);
            }
        }
    }
}
