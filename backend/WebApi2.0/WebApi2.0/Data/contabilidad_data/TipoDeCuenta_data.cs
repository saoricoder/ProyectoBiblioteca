using System.Data;
using Microsoft.Data.SqlClient;
using WebApi2._0.models.contabilidad;

namespace WebApi2._0.Data.contabilidad_data
{
    public class TipoDeCuenta_data
    {

        private static readonly string baseDatos = "contabilidad";

        // InsertarTipoDeCuenta
        public static bool InsertarTipoDeCuenta(TipoDeCuenta_models TipoDeCuenta)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO tipodecuenta (codigo, nombre) VALUES (@codigo, @nombre)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", TipoDeCuenta.Codigo);
            comando.Parameters.AddWithValue("@nombre", TipoDeCuenta.Nombre);

            try
            {
                int rowsAffected = comando.ExecuteNonQuery();
                if (rowsAffected > 0)
                {
                    return true;
                }
                else
                {
                    return false;  // No se insertaron filas (probablemente el código ya existe).
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error al insertar TipoDeCuenta: {e.Message}");  // Loguear el error.
                return false;
            }
        }

        // ConsultarTipoDeCuentas
        public static List<TipoDeCuenta_models> ConsultarTipoDeCuentas()
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM tipodecuenta";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<TipoDeCuenta_models> lista = new();
            while (reader.Read())
            {
                TipoDeCuenta_models tipodecuenta = new()
                {
                    Codigo = reader.IsDBNull(1) ? 1 : reader.GetInt32(1),
                    Nombre = reader.IsDBNull(2) ? string.Empty : (reader.GetFieldType(2) == typeof(string) ? reader.GetString(2) : reader.GetValue(2).ToString())
                };
                lista.Add(tipodecuenta);
            }
            return lista;
        }


        // ConsultarTipoDeCuenta
        public static TipoDeCuenta_models ConsultarTipoDeCuenta(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM tipodecuenta WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();

            if (reader.Read())  // Si el registro es encontrado.
            {
                return new TipoDeCuenta_models()
                {
                    Codigo = reader.GetInt32(1),

                    // Evitar el error de cast si 'Nombre' puede ser NULL
                    Nombre = reader.IsDBNull(2) ? string.Empty : reader.GetValue(2).ToString()  // Manejo de NULL
                };
            }
            return null;  // Si no se encuentra el registro, retornar null
        }


        // ActualizarTipoDeCuenta
        public static bool ActualizarTipodeCuenta(int codigo, TipoDeCuenta_models TipoDeCuenta)
        {
            if (TipoDeCuenta == null)
            {
                Console.WriteLine("Error: El objeto TipoDeCuenta es nulo.");
                return false;
            }

            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);

            try
            {
                conexion.Open();

                string query = "UPDATE tipodecuenta SET nombre = @nombre WHERE codigo = @codigo";
                using SqlCommand comando = new(query, conexion);
                comando.Parameters.AddWithValue("@codigo", codigo);
                comando.Parameters.AddWithValue("@nombre", TipoDeCuenta.Nombre ?? (object)DBNull.Value); // Maneja valores nulos

                int rowsAffected = comando.ExecuteNonQuery();

                if (rowsAffected > 0)
                {
                    Console.WriteLine($"Actualización exitosa. Filas afectadas: {rowsAffected}");
                    return true;
                }
                else
                {
                    Console.WriteLine($"Advertencia: No se encontró un tipo de cuenta con el código {codigo}.");
                    return false;
                }
            }
            catch (SqlException sqlEx)
            {
                Console.WriteLine($"Error SQL al actualizar TipoDeCuenta (Código {codigo}): {sqlEx.Message}");
                return false;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error general al actualizar TipoDeCuenta: {ex.Message}");
                return false;
            }
        }


        // EliminarTipoDeCuenta
        public static bool EliminarTipoDeCuenta(int codigo)
        {
            using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM tipodecuenta WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);

            try
            {
                int rowsAffected = comando.ExecuteNonQuery();
                return rowsAffected > 0;  // Retornar true si se eliminó al menos una fila.
            }
            catch (Exception e)
            {
                Console.WriteLine($"Error al eliminar TipoDeCuenta: {e.Message}");  // Loguear el error.
                return false;
            }
        }

        //Buscar TipoDeCuenta
        public static List<TipoDeCuenta_models>? BuscarTipoDeCuenta(int? codigo = null, string? nombre = null)
        {
            try
            {
                using SqlConnection conexion = Conn_general.ObtenerConexion(baseDatos);
                conexion.Open();

                string query = "SELECT codigo AS Codigo, nombre AS Nombre FROM tipodecuenta WHERE 1=1";

                if (codigo.HasValue)
                {
                    query += " AND codigo = @codigo";
                }

                if (!string.IsNullOrEmpty(nombre))
                {
                    query += " AND nombre LIKE @nombre";
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

                using SqlDataReader reader = comando.ExecuteReader();
                List<TipoDeCuenta_models> lista = new();

                while (reader.Read())
                {
                    TipoDeCuenta_models tipodecuenta = new()
                    {
                        Codigo = reader.GetInt32(reader.GetOrdinal("Codigo")),
                        Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? string.Empty : reader.GetString(reader.GetOrdinal("Nombre"))
                    };
                    lista.Add(tipodecuenta);
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

