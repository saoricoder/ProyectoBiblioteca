using Microsoft.Data.SqlClient;
using WebApi3.Models.Biblioteca_models;

namespace WebApi3.Data.Biblioteca_data
{
    public class DetallePrestamos_data
    {
        private static readonly string baseDatos = "BIBLIOTECA";

        // Insertar DetallePrestamo
        public static bool InsertarDetalle(DetallePrestamos_models detalle)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO DetallePrestamos (CodigoLibro, Cantidad, FechaEntrega) VALUES (@CodigoLibro, @Cantidad, @FechaEntrega)";
            using SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@CodigoLibro", detalle.CodigoLibro);
            comando.Parameters.AddWithValue("@Cantidad", detalle.Cantidad);
            comando.Parameters.AddWithValue("@FechaEntrega", detalle.FechaEntrega);

            try
            {
                return comando.ExecuteNonQuery() > 0;
            }
            catch (Exception)
            {
                return false;
            }
        }

        // Consultar todos los Detalles de Préstamos
        public static List<DetallePrestamos_models> ConsultarDetalles()
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM DetallePrestamos";
            using SqlCommand comando = new(query, conexion);
            using SqlDataReader reader = comando.ExecuteReader();
            List<DetallePrestamos_models> lista = [];
            while (reader.Read())
            {
                lista.Add(new DetallePrestamos_models()
                {
                    Id = reader.GetInt32(0),
                    CodigoLibro = reader.GetInt32(1),
                    Cantidad = reader.GetInt32(2),
                    FechaEntrega = reader.GetDateTime(3)
                });
            }
            return lista;
        }

        // Consultar Detalle por ID
        public static DetallePrestamos_models? ConsultarDetalle(int id)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM DetallePrestamos WHERE id = @id";
            using SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@id", id);
            using SqlDataReader reader = comando.ExecuteReader();
            if (reader.Read())
            {
                return new DetallePrestamos_models()
                {
                    Id = reader.GetInt32(0),
                    CodigoLibro = reader.GetInt32(1),
                    Cantidad = reader.GetInt32(2),
                    FechaEntrega = reader.GetDateTime(3)
                };
            }
            return null;
        }

        // Actualizar Detalle
        public static bool ActualizarDetalle(int id, DetallePrestamos_models detalle)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "UPDATE DetallePrestamos SET CodigoLibro = @CodigoLibro, Cantidad = @Cantidad, FechaEntrega = @FechaEntrega WHERE id = @id";
            using SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@id", id);
            comando.Parameters.AddWithValue("@CodigoLibro", detalle.CodigoLibro);
            comando.Parameters.AddWithValue("@Cantidad", detalle.Cantidad);
            comando.Parameters.AddWithValue("@FechaEntrega", detalle.FechaEntrega);

            return comando.ExecuteNonQuery() > 0;
        }

        // Eliminar Detalle por ID
        public static bool EliminarDetalle(int id)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM DetallePrestamos WHERE id = @id";
            using SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@id", id);

            return comando.ExecuteNonQuery() > 0;
        }
    }
}
