using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApi3.Data.Token_data;
using WebApi3.Models.Token_models;
using WebApi3.Models.User_models;

namespace WebApi3.Data.User_data
{
    public class TokenService_data(IConfiguration config, TokenData_data tokenData)
    {
        private readonly IConfiguration _config = config;
        private readonly TokenData_data _tokenData = tokenData;

        public string GenerarAccessToken(string userId, string role)
        {
            var claims = new[]
            {
            new Claim(JwtRegisteredClaimNames.Sub, userId),
            new Claim(ClaimTypes.Role, role),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(double.Parse(_config["Jwt:AccessTokenExpirationMinutes"])),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerarRefreshToken()
        {
            return Guid.NewGuid().ToString().Replace("-", "");
        }

        public void GuardarRefreshToken(string userId, string refreshToken)
        {
            var tokenModel = new Token_models
            {
                UserId = userId,
                Token = refreshToken,
                ExpirationDate = DateTime.Now.AddDays(int.Parse(_config["Jwt:RefreshTokenExpirationDays"]))
            };
            _tokenData.GuardarRefreshToken(tokenModel);
        }
        // Método para verificar la contraseña
        public bool VerificarPassword(string passwordIngresado, string passwordEncriptado)
        {
            // Compara la contraseña ingresada con el hash almacenado
            return BCrypt.Net.BCrypt.Verify(passwordIngresado, passwordEncriptado);
        }

        //Obtener ID y role del Token
        public string ObtenerUserIdDelToken(string accessToken)
        {
            // 1. Obtener la clave secreta del archivo de configuración
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                // 2. Validar el token
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = key
                };

                // 3. Intentar validar el token
                var principal = tokenHandler.ValidateToken(accessToken, validationParameters, out SecurityToken validatedToken);

                // 4. Extraer el UserId del token
                var userIdClaim = principal.Claims.FirstOrDefault(claim => claim.Type == JwtRegisteredClaimNames.Sub);

                if (userIdClaim != null)
                {
                    return userIdClaim.Value;
                }
                else
                {
                    throw new Exception("No se encontró un UserId válido en el token.");
                }
            }
            catch (Exception ex)
            {
                // Si el token no es válido, lanzar una excepción o manejar el error
                throw new SecurityTokenException("Token inválido o expirado.", ex);
            }
        }


        public string ObtenerUserRoleToken(string accessToken)
        {
            // 1. Obtener la clave secreta del archivo de configuración
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var tokenHandler = new JwtSecurityTokenHandler();

            try
            {
                // 2. Validar el token
                var validationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = _config["Jwt:Issuer"],
                    ValidAudience = _config["Jwt:Audience"],
                    IssuerSigningKey = key
                };

                // 3. Intentar validar el token
                var principal = tokenHandler.ValidateToken(accessToken, validationParameters, out SecurityToken validatedToken);

                // 4. Extraer el Role del token
                var roleClaim = principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.Role);

                if (roleClaim != null)
                {
                    return roleClaim.Value; // Devuelve el role como string (ej. "user", "admin")
                }
                else
                {
                    throw new Exception("No se encontró un Role válido en el token.");
                }
            }
            catch (Exception ex)
            {
                // Si el token no es válido, lanzar una excepción o manejar el error
                throw new SecurityTokenException("Token inválido o expirado.", ex);
            }
        }

        public bool RefreshTokenActivo(string userId)
        {
            return _tokenData.RefreshTokenActivo(userId);
        }

        public bool RevocarRefreshToken(string refreshToken)
        {
            return _tokenData.RevocarRefreshToken(refreshToken);
        }

        public static Payload_models PayloadData(string accesstoken)
        {
            Console.WriteLine($"Token: {accesstoken}");
            // Mapear el payload a un objeto de la clase Payload_models
            var payloadData = new Payload_models();

            // Crear un objeto JwtSecurityTokenHandler
            var handler = new JwtSecurityTokenHandler();

            // Decodificar el token sin verificar la firma

            if (handler.ReadToken(accesstoken) is JwtSecurityToken jsonToken)
            {
                // Acceder al payload
                var payload = jsonToken.Payload;

                // Mapear las propiedades del payload a las propiedades del objeto payloadData
                payloadData.UserId = payload.ContainsKey("sub") ? payload["sub"].ToString() : null;
                payloadData.Role = payload.ContainsKey("http://schemas.microsoft.com/ws/2008/06/identity/claims/role") ? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"].ToString() : null;
                // Puedes agregar más asignaciones si tienes más propiedades en el payload

                // Mostrar el objeto mapeado
                Console.WriteLine("Datos del Payload:");
                Console.WriteLine($"UserId: {payloadData.UserId}");
                Console.WriteLine($"Role: {payloadData.Role}");
            }
            else
            {
                Console.WriteLine("El token no es válido o no pudo ser decodificado.");
            }

            return payloadData;
        }
    }
}
