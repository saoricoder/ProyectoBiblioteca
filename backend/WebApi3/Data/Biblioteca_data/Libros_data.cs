using System.Data;
using Microsoft.Data.SqlClient;
using WebApi3.Models.Biblioteca_models;
using WebApi3.Models.Contabilidad_models;

namespace WebApi3.Data.Biblioteca_data
{
    public class Libros_data
    {
        private static readonly string baseDatos = "BIBLIOTECA";

        public static bool InsertarLibro(Libros_models libro)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO Libros (ISBN, Titulo, AutorCodigo, ValorPrestamo) VALUES (@ISBN, @Titulo, @AutorCodigo, @ValorPrestamo)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@ISBN", libro.ISBN);
            comando.Parameters.AddWithValue("@Titulo", libro.Titulo);
            comando.Parameters.AddWithValue("@AutorCodigo", libro.AutorCodigo);
            comando.Parameters.AddWithValue("@ValorPrestamo", libro.ValorPrestamo);

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

        public static List<Libros_models> ConsultarLibros()
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Libros";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Libros_models> lista = [];

            while (reader.Read())
            {
                Libros_models libro = new()
                {
                    ISBN = reader.GetInt32(0),
                    Titulo = reader.GetString(1),
                    AutorCodigo = reader.GetInt32(2),
                    ValorPrestamo = reader.GetDecimal(3)
                };
                lista.Add(libro);
            }
            return lista;
        }

        public static Libros_models? ConsultarLibro(int isbn)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Libros WHERE ISBN = @ISBN";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@ISBN", isbn);
            SqlDataReader reader = comando.ExecuteReader();

            if (reader.Read())
            {
                return new Libros_models
                {
                    ISBN = reader.GetInt32(0),
                    AutorCodigo = reader.GetInt32(1),
                    Titulo = reader.GetString(2),
                    ValorPrestamo = reader.GetDecimal(3)
                };
            }
            return null;
        }

        public static bool ActualizarLibro(string isbn, Libros_models libro)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "UPDATE Libros SET Titulo = @Titulo, AutorCodigo = @AutorCodigo, ValorPrestamo = @ValorPrestamo WHERE ISBN = @ISBN";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@ISBN", isbn);
            comando.Parameters.AddWithValue("@Titulo", libro.Titulo);
            comando.Parameters.AddWithValue("@AutorCodigo", libro.AutorCodigo);
            comando.Parameters.AddWithValue("@ValorPrestamo", libro.ValorPrestamo);

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

        public static bool EliminarLibro(string isbn)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM Libros WHERE ISBN = @ISBN";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@ISBN", isbn);

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

        //Buscar Libro
        public static List<Libros_models>? BuscarLibro(int? isbn = null, int? autorCodigo = null, string? titulo = null)
        {
            try
            {
                using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
                conexion.Open();

                string query = "SELECT ISBN AS isbn, AutorCodigo AS AutorCodigo, Titulo AS Titulo, ValorPrestamo AS ValorPrestamo FROM Libros WHERE 1=1";

                if (isbn.HasValue)
                {
                    query += " AND isbn = @isbn";
                }

                if (autorCodigo.HasValue)
                {
                    query += " AND AutorCodigo = @autorCodigo";
                }

                if (!string.IsNullOrEmpty(titulo))
                {
                    query += " AND Titulo LIKE @titulo";
                }

                using SqlCommand comando = new(query, conexion);

                if (isbn.HasValue)
                {
                    comando.Parameters.Add(new SqlParameter("@isbn", SqlDbType.Int) { Value = isbn.Value });
                }

                if (autorCodigo.HasValue)
                {
                    comando.Parameters.Add(new SqlParameter("@autorCodigo", SqlDbType.Int) { Value = autorCodigo.Value });
                }

                if (!string.IsNullOrEmpty(titulo))
                {
                    comando.Parameters.Add(new SqlParameter("@titulo", SqlDbType.NVarChar) { Value = $"%{titulo}%" });
                }

                using SqlDataReader reader = comando.ExecuteReader();
                List<Libros_models> lista = [];

                while (reader.Read())
                {
                    Libros_models libro = new()
                    {
                        ISBN = reader.GetInt32(reader.GetOrdinal("ISBN")),
                        AutorCodigo = reader.GetInt32(reader.GetOrdinal("AutorCodigo")),
                        Titulo = reader.IsDBNull(reader.GetOrdinal("Titulo")) ? string.Empty : reader.GetString(reader.GetOrdinal("Titulo")),
                        ValorPrestamo = reader.GetDecimal(reader.GetOrdinal("ValorPrestamo"))
                    };

                    lista.Add(libro);
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
