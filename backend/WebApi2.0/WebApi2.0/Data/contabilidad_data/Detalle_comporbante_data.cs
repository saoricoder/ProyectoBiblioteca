using System.Data;
using Microsoft.Data.SqlClient;
using WebApi2._0.models.contabilidad;

namespace WebApi2._0.Data.contabilidad_data
{
    public class Detalle_comporbante_data
    {
        private static readonly string baseDatos = "contabilidad";

        //Insertar Detalle
        public static bool InsertarDetalle(Detalle_comprobante_models Detalle)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO detalle_comprobante (numero, cuenta, debe, haber) VALUES (@numero, @cuenta, @debe, @haber)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@numero", Detalle.Numero);
            comando.Parameters.AddWithValue("@cuenta", Detalle.Cuenta);
            comando.Parameters.AddWithValue("@debe", Detalle.Debe);
            comando.Parameters.AddWithValue("@haber", Detalle.Haber);

            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        //Consultar todos los detalles
        public static List<Detalle_comprobante_models> ConsultarDetalles()
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM detalle_comprobante";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Detalle_comprobante_models> lista = new();
            while (reader.Read())
            {
                Detalle_comprobante_models detalle = new()
                {
                    codigo = reader.IsDBNull(0) ? 0: reader.GetInt32(0),
                    Numero = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                    Cuenta = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                    Debe = (float)(reader.IsDBNull(3) ? 0 : reader.GetDouble(3)),
                    Haber = (float)(reader.IsDBNull(4) ? 0 : reader.GetDouble(4))

                };
                lista.Add(detalle);
            }
            return lista;
        }

        //Consultar Detalle por numero
        public static Detalle_comprobante_models ConsultarDetalle(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM detalle_comprobante WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();
            if(reader.Read())
            {
                return new Detalle_comprobante_models()
                {
                    codigo = reader.GetInt32(0),
                    Numero = reader.GetInt32(1),
                    Cuenta = reader.GetString(2),
                    Debe = (float)reader.GetDouble(3),
                    Haber = (float)reader.GetDouble(4)

                };
            }

            return null;
        }

        //Obtner comprobantes por numero
        public static List<Detalle_comprobante_models> ObtenerDetalles(int numero)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM detalle_comprobante WHERE numero=@numero";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@numero", numero);
            SqlDataReader reader = comando.ExecuteReader();
            List<Detalle_comprobante_models> lista = new();
            while (reader.Read())
            {
                Detalle_comprobante_models detalle = new()
                {
                    codigo = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                    Numero = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                    Cuenta = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                    Debe = reader.IsDBNull(3) ? 0 : (float)reader.GetDouble(3),  // Corrected
                    Haber = reader.IsDBNull(4) ? 0 : (float)reader.GetDouble(4)   // Corrected
                };
                lista.Add(detalle);
            }
            return lista;
        }


        //Actualizar Detalle
        public static bool ActualizarDetalle(int codigo, Detalle_comprobante_models Detalle)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();

            string query = @"
        UPDATE detalle_comprobante 
        SET numero = @numero, 
            cuenta = @cuenta, 
            debe = @debe, 
            haber = @haber 
        WHERE codigo = @codigo";  // Asegúrate de que "codigo" es la clave primaria

            using SqlCommand comando = new(query, conexion);

            comando.Parameters.AddWithValue("@codigo", codigo);
            comando.Parameters.AddWithValue("@numero", Detalle.Numero);
            comando.Parameters.AddWithValue("@cuenta", Detalle.Cuenta);
            comando.Parameters.AddWithValue("@debe", Detalle.Debe);
            comando.Parameters.AddWithValue("@haber", Detalle.Haber);

            try
            {
                int rowsAffected = comando.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    Console.WriteLine($"Éxito: {rowsAffected} filas actualizadas.");
                    return true;
                }
                else
                {
                    Console.WriteLine("Advertencia: No se encontró un registro con el código proporcionado.");
                    return false;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error al actualizar Detalle: {ex.Message}");
                return false;
            }
        }


        //Eliminar Detalles
        public static bool EliminarDetalleUno(int codigo)
        {
            try
            {
                using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
                if (conexion.State != System.Data.ConnectionState.Open)
                    conexion.Open();

                string query = "DELETE FROM detalle_comprobante WHERE codigo = @codigo";

                using SqlCommand comando = new(query, conexion);
                comando.Parameters.AddWithValue("@codigo", codigo);

                int rowsAffected = comando.ExecuteNonQuery();
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error al eliminar el detalle con código {codigo}: {ex.Message}");
                return false;
            }
        }

        //Eliminar todos Detalles
        public static bool EliminarDetalle(int numero)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM detalle_comprobante WHERE numero = @numero";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@numero", numero);

            try
            {
                int rowsAffected = comando.ExecuteNonQuery();
                return rowsAffected > 0;
            }
            catch (Exception ex)
            {
                return false;
            }
        }


        //Buscar Detalle
        public static List<Detalle_comprobante_models> BuscarDetalle(int? haber=null , string? cuenta = null,int? debe=null)
        {
            try
            {
                using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
                conexion.Open();

                string query = "SELECT numero AS Numero, fecha AS Fecha, observaciones AS Observaciones, cuenta AS Cuenta, debe AS Debe, haber AS Haber FROM comprobante WHERE 1=1";

                if (haber.HasValue)
                {
                    query += " AND haber = @haber";
                }

                if (!string.IsNullOrEmpty(cuenta))
                {
                    query += " AND cuenta LIKE @cuenta";
                }
                if (debe.HasValue)
                {
                    query += " AND debe = @debe";
                }

                using SqlCommand comando = new(query, conexion);

                if (haber.HasValue)
                {
                    comando.Parameters.Add(new SqlParameter("@haber", SqlDbType.Int) { Value = haber.Value });
                }

                if (!string.IsNullOrEmpty(cuenta))
                {
                    comando.Parameters.Add(new SqlParameter("@cuenta", SqlDbType.NVarChar) { Value = $"%{cuenta}%" });
                }

                if (debe.HasValue)
                {
                    comando.Parameters.Add(new SqlParameter("@debe", SqlDbType.Int) { Value = debe.Value });
                }

                using SqlDataReader reader = comando.ExecuteReader();
                List<Detalle_comprobante_models> lista = new();

                while (reader.Read())
                {
                    Detalle_comprobante_models detalle = new()
                    {
                        Numero = reader.GetInt32(reader.GetOrdinal("Numero")),
                        Cuenta = reader.IsDBNull(reader.GetOrdinal("Cuenta")) ? string.Empty : reader.GetString(reader.GetOrdinal("Cuenta")),
                        Debe = reader.IsDBNull(reader.GetOrdinal("Debe")) ? 0 : reader.GetFloat(reader.GetOrdinal("Debe")),
                        Haber = reader.IsDBNull(reader.GetOrdinal("Haber")) ? 0 : reader.GetFloat(reader.GetOrdinal("Haber"))
                    };

                    lista.Add(detalle);
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
