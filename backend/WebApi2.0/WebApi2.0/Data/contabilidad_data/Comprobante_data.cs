using Microsoft.Data.SqlClient;
using WebApi2._0.models.contabilidad;
using System;
using System.Data;

namespace WebApi2._0.Data.contabilidad_data
{
    public class Comprobante_data
    {
        private static readonly string baseDatos = "contabilidad";

        // Insertar Comprobante
        public static bool InsertarComprobante(Comprobante_models Comprobante)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO comprobante (numero, fecha, observaciones) VALUES (@numero, @fecha, @observaciones)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@numero", Comprobante.Numero);
            comando.Parameters.AddWithValue("@fecha", Comprobante.Fecha);
            comando.Parameters.AddWithValue("@observaciones", Comprobante.Observaciones);

            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error al insertar Comprobante: {e.Message}");  // Loguear el error
                return false;
            }
        }

        // Consultar todos los Comprobantes
        public static List<Comprobante_models> ConsultarComprobantes()
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM comprobante";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Comprobante_models> lista = [];
            while (reader.Read())
            {
                Comprobante_models comprobante = new()
                {
                    Numero = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                    Fecha = reader.IsDBNull(2) ? DateTime.MinValue : reader.GetDateTime(2),
                    Observaciones = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                };
                lista.Add(comprobante);
            }
            return lista;
        }

        // Consultar Comprobante por código
        public static Comprobante_models? ConsultarComprobante(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM comprobante WHERE numero = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();
            if (reader.Read())
            {
                return new Comprobante_models()
                {
                    Numero = reader.GetInt32(1),
                    Fecha = reader.GetDateTime(2),
                    Observaciones = reader.GetString(3)
                };
            }
            return null; // Si no se encuentra el comprobante, retorna null.
        }

        // Actualizar Comprobante
        public static bool ActualizarComprobante(int numero, Comprobante_models Comprobante)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();

            string query = "UPDATE comprobante SET fecha = @fecha, observaciones = @observaciones WHERE numero = @numero";
            SqlCommand comando = new(query, conexion);

            // Corrección: Usamos @numero en todos los lugares correctos
            comando.Parameters.AddWithValue("@numero", numero);
            comando.Parameters.AddWithValue("@fecha", Comprobante.Fecha);
            comando.Parameters.AddWithValue("@observaciones", Comprobante.Observaciones);

            try
            {
                int rowsAffected = comando.ExecuteNonQuery();
                Console.WriteLine($"Filas afectadas: {rowsAffected}"); // Log para depuración
                return rowsAffected > 0;  // Retorna true si al menos una fila fue actualizada
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error al actualizar Comprobante: {e.Message}");  // Log de error
                return false;
            }
        }


        // Eliminar Comprobante
        public static bool EliminarComprobante(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM comprobante WHERE numero = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);

            try
            {
                int rowsAffected = comando.ExecuteNonQuery();
                return rowsAffected > 0;  // Si se eliminó al menos una fila, retorna true.
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error al eliminar Comprobante: {e.Message}");  // Loguear el error
                return false;
            }
        }

        // Buscar Comprobante
        public static List<Comprobante_models>? BuscarComprobante(int? numero = null, string? fecha = null)
        {
            try
            {
                using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
                conexion.Open();

                string query = "SELECT numero AS Numero, fecha AS Fecha, observaciones AS Observaciones FROM comprobante WHERE 1=1";

                if (numero.HasValue)
                {
                    query += " AND numero = @numero";
                }

                if (!string.IsNullOrEmpty(fecha))
                {
                    query += " AND CAST(fecha AS DATE) = @fecha";
                }

                using SqlCommand comando = new(query, conexion);

                if (numero.HasValue)
                {
                    comando.Parameters.Add(new SqlParameter("@numero", SqlDbType.Int) { Value = numero.Value });
                }

                if (!string.IsNullOrEmpty(fecha))
                {
                    comando.Parameters.Add(new SqlParameter("@fecha", SqlDbType.Date) { Value = DateTime.Parse(fecha).Date });
                }

                using SqlDataReader reader = comando.ExecuteReader();
                List<Comprobante_models> lista = [];

                while (reader.Read())
                {
                    Comprobante_models comprobante = new()
                    {
                        Numero = reader.GetInt32(reader.GetOrdinal("Numero")),
                        Fecha = reader.IsDBNull(reader.GetOrdinal("Fecha")) ? DateTime.MinValue : reader.GetDateTime(reader.GetOrdinal("Fecha")),
                        Observaciones = reader.IsDBNull(reader.GetOrdinal("Observaciones")) ? string.Empty : reader.GetString(reader.GetOrdinal("Observaciones"))
                    };

                    lista.Add(comprobante);
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
