
using Microsoft.Data.SqlClient;
using WebApi2._0.models.biblioteca;

namespace WebApi2._0.Data.bibioteca_data
{
 
    public class Libro_data
    {
        private static readonly string baseDatos = "master";

        public static bool InsertarLibro(Libro_models libro)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
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

        public static List<Libro_models> ConsultarLibros()
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Libros";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Libro_models> lista = [];

            while (reader.Read())
            {
                Libro_models libro = new()
                {
                    ISBN = reader.GetString(0),
                    Titulo = reader.GetString(1),
                    AutorCodigo = reader.GetInt32(2),
                    ValorPrestamo = reader.GetDecimal(3)
                };
                lista.Add(libro);
            }
            return lista;
        }

        public static Libro_models? ConsultarLibro(string isbn)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM Libros WHERE ISBN = @ISBN";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@ISBN", isbn);
            SqlDataReader reader = comando.ExecuteReader();

            if (reader.Read())
            {
                return new Libro_models
                {
                    ISBN = reader.GetString(0),
                    Titulo = reader.GetString(1),
                    AutorCodigo = reader.GetInt32(2),
                    ValorPrestamo = reader.GetDecimal(3)
                };
            }
            return null;
        }

        public static bool ActualizarLibro(string isbn, Libro_models libro)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
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
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
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
    }

}



