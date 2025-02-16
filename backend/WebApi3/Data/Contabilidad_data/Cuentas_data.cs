using Microsoft.Data.SqlClient;
using System.Data;
using WebApi3.Models.Contabilidad_models;

namespace WebApi3.Data.Contabilidad_data
{
    public class Cuentas_data
    {
        private static readonly string baseDatos = "contabilidad";

        public static bool InsertarCuenta(Cuentas_models Cuenta)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO cuenta (codigo,nombre,tipodecuenta,saldo) VALUES (@codigo,@nombre,@tipodecuenta,@saldo)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", Cuenta.Codigo);
            comando.Parameters.AddWithValue("@nombre", Cuenta.Nombre);
            comando.Parameters.AddWithValue("@tipodecuenta", Cuenta.TipoDeCuenta);
            comando.Parameters.AddWithValue("@saldo", Cuenta.Saldo);

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

        public static List<Cuentas_models> ConsultarCuentas()
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM cuenta";
            SqlCommand comando = new(query, conexion);
            SqlDataReader reader = comando.ExecuteReader();
            List<Cuentas_models> lista = [];
            while (reader.Read())
            {
                Cuentas_models cuenta = new()
                {
                    Codigo = reader.IsDBNull(1) ? 0 : reader.GetInt32(1),
                    Nombre = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                    TipoDeCuenta = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                    Saldo = reader.IsDBNull(4) ? 0 : reader.GetDecimal(4),
                };
                lista.Add(cuenta);
            }
            return lista;
        }
        public static Cuentas_models ConsultarCuenta(int codigo)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM cuenta WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            SqlDataReader reader = comando.ExecuteReader();
            Cuentas_models cuenta = new();
            if (reader.Read())
            {
                cuenta.Codigo = reader.GetInt32(1);
                cuenta.Nombre = reader.GetString(2);
                cuenta.TipoDeCuenta = reader.GetString(3);
                cuenta.Saldo = reader.GetDecimal(4);
            }
            return cuenta;
        }
        public static bool ActualizarCuenta(int codigo, Cuentas_models Cuenta)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "UPDATE cuenta SET nombre = @nombre, tipodecuenta = @tipodecuenta,saldo = @saldo WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
            comando.Parameters.AddWithValue("@nombre", Cuenta.Nombre);
            comando.Parameters.AddWithValue("@tipodecuenta", Cuenta.TipoDeCuenta);
            comando.Parameters.AddWithValue("@saldo", Cuenta.Saldo);
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

        public static bool EliminarCuenta(int codigo)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "DELETE FROM cuenta WHERE codigo = @codigo";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@codigo", codigo);
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

        //Buscar Cuenta
        public static List<Cuentas_models>? BuscarCuenta(int? codigo = null, string? nombre = null, string? tipodecuenta = null)
        {
            try
            {
                using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
                conexion.Open();

                string query = "SELECT codigo AS Codigo, nombre AS Nombre, tipodecuenta AS TipoDeCuenta FROM cuenta WHERE 1=1";

                if (codigo.HasValue)
                {
                    query += " AND codigo = @codigo";
                }

                if (!string.IsNullOrEmpty(nombre))
                {
                    query += " AND nombre LIKE @nombre";
                }

                if (!string.IsNullOrEmpty(tipodecuenta))
                {
                    query += " AND tipodecuenta LIKE @tipodecuenta";
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

                if (!string.IsNullOrEmpty(tipodecuenta))
                {
                    comando.Parameters.Add(new SqlParameter("@tipodecuenta", SqlDbType.NVarChar) { Value = $"%{tipodecuenta}%" });
                }

                using SqlDataReader reader = comando.ExecuteReader();
                List<Cuentas_models> lista = [];

                while (reader.Read())
                {
                    Cuentas_models cuenta = new()
                    {
                        Codigo = reader.GetInt32(reader.GetOrdinal("Codigo")),
                        Nombre = reader.IsDBNull(reader.GetOrdinal("Nombre")) ? string.Empty : reader.GetString(reader.GetOrdinal("Nombre")),
                        TipoDeCuenta = reader.IsDBNull(reader.GetOrdinal("TipoDeCuenta")) ? string.Empty : reader.GetString(reader.GetOrdinal("TipoDeCuenta")),
                        Saldo = reader.GetDecimal(reader.GetOrdinal("Saldo"))
                    };

                    lista.Add(cuenta);
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
