using Microsoft.Data.SqlClient;
using WebApi2._0.models.biblioteca;

namespace WebApi2._0.Data.bibioteca_data
{
    public class DetallePrestamos_data
    {
        private static readonly string baseDatos = "master";

        // Insertar DetallePrestamo
        public static bool InsertarDetalle(DetallePrestamo_model detalle)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
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
        public static List<DetallePrestamo_model> ConsultarDetalles()
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM DetallePrestamos";
            using SqlCommand comando = new(query, conexion);
            using SqlDataReader reader = comando.ExecuteReader();
            List<DetallePrestamo_model> lista = new();
            while (reader.Read())
            {
                lista.Add(new DetallePrestamo_model()
                {
                    id = reader.GetInt32(0),
                    CodigoLibro = reader.GetInt32(1),
                    Cantidad = reader.GetInt32(2),
                    FechaEntrega = reader.GetDateTime(3)
                });
            }
            return lista;
        }

        // Consultar Detalle por ID
        public static DetallePrestamo_model ConsultarDetalle(int id)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM DetallePrestamos WHERE id = @id";
            using SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@id", id);
            using SqlDataReader reader = comando.ExecuteReader();
            if (reader.Read())
            {
                return new DetallePrestamo_model()
                {
                    id = reader.GetInt32(0),
                    CodigoLibro = reader.GetInt32(1),
                    Cantidad = reader.GetInt32(2),
                    FechaEntrega = reader.GetDateTime(3)
                };
            }
            return null;
        }

        // Actualizar Detalle
        public static bool ActualizarDetalle(int id, DetallePrestamo_model detalle)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
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
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM DetallePrestamos WHERE id = @id";
            using SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@id", id);

            return comando.ExecuteNonQuery() > 0;
        }
    }


}
