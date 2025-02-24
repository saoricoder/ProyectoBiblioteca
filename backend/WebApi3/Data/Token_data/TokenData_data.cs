using Microsoft.Data.SqlClient;
using WebApi3.Models.Token_models;

namespace WebApi3.Data.Token_data
{
    public class TokenData_data
    {
        private static readonly string baseDatos = "DBWEBAPI";

        public void GuardarRefreshToken(Token_models token)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            var query = @"INSERT INTO RefreshTokens (UserId, Token, ExpirationDate)
                          VALUES (@UserId, @Token, @ExpirationDate)";

            var command = new SqlCommand(query, conexion);
            command.Parameters.AddWithValue("@UserId", token.UserId);
            command.Parameters.AddWithValue("@Token", token.Token);
            command.Parameters.AddWithValue("@ExpirationDate", token.ExpirationDate);

            conexion.Open();
            command.ExecuteNonQuery();
        }

        public Token_models? ObtenerRefreshToken(string refreshToken)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            var query = @"SELECT UserId, Token, ExpirationDate 
                          FROM RefreshTokens 
                          WHERE Token = @Token";

            var command = new SqlCommand(query, conexion);
            command.Parameters.AddWithValue("@Token", refreshToken);

            conexion.Open();
            using var reader = command.ExecuteReader();
            if (reader.Read())
            {
                return new Token_models
                {
                    UserId = reader["UserId"].ToString(),
                    Token = reader["Token"].ToString(),
                    ExpirationDate = Convert.ToDateTime(reader["ExpirationDate"])
                };
            }
            return null;
        }

        public bool ValidarRefreshToken(string refreshToken, string userId)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = @"
            SELECT COUNT(*) 
            FROM RefreshTokens 
            WHERE Token = @Token AND UserId = @UserId 
            AND ExpirationDate > GETDATE()";

            using SqlCommand cmd = new(query, conexion);
            cmd.Parameters.AddWithValue("@Token", refreshToken);
            cmd.Parameters.AddWithValue("@UserId", userId);

            int count = (int)cmd.ExecuteScalar();
            return count > 0;
        }

        public bool ActualizarRefreshToken(string tokenAntiguo, string nuevoToken)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();

            // Aquí ajustamos la consulta SQL para actualizar el refresh token
            string query = @"
            UPDATE RefreshTokens
            SET Token = @NuevoToken,
            ExpirationDate = @NuevaFechaExpiracion,
            UpdatedAt = @UpdatedAt
        WHERE Token = @TokenAntiguo";

            using SqlCommand cmd = new(query, conexion);
            cmd.Parameters.AddWithValue("@NuevoToken", nuevoToken);
            cmd.Parameters.AddWithValue("@NuevaFechaExpiracion", DateTime.Now.AddDays(7)); // 7 días de expiración
            cmd.Parameters.AddWithValue("@TokenAntiguo", tokenAntiguo);
            cmd.Parameters.AddWithValue("@UpdatedAt", DateTime.Now);

            int filasAfectadas = cmd.ExecuteNonQuery();

            // Retorna true si se actualizaron registros, false si no
            return filasAfectadas > 0;
        }

        public bool RefreshTokenActivo(string userId)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();

            string query = @"
            SELECT COUNT(*) 
            FROM RefreshTokens 
            WHERE UserId = @UserId 
            AND ExpirationDate > GETDATE() 
            AND IsRevoked = 0";

            using SqlCommand cmd = new(query, conexion);
            cmd.Parameters.AddWithValue("@UserId", userId);

            int count = (int)cmd.ExecuteScalar();
            return count > 0;
        }

        public bool RevocarRefreshToken(string refreshToken)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = @"
            UPDATE RefreshTokens 
            SET IsRevoked = 1 
            WHERE Token = @Token AND IsRevoked = 0";

            using SqlCommand cmd = new(query, conexion);
            cmd.Parameters.AddWithValue("@Token", refreshToken);

            int rowsAffected = cmd.ExecuteNonQuery();
            return rowsAffected > 0; // Retorna true si se revocó correctamente
        }

    }
}
