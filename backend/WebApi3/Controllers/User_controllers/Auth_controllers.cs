using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using WebApi3.Data.Token_data;
using WebApi3.Data.User_data;
using WebApi3.Models.User_models;

namespace WebApi3.Controllers.User_controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Auth_controllers(ILogger<Auth_controllers> logger, TokenService_data tokenService) : ControllerBase
    {
        private readonly ILogger<Auth_controllers> _logger = logger;
        private readonly TokenService_data _tokenService = tokenService;
        private readonly Usuarios_data _usuariosData = new();

        // Requiere que el usuario esté autenticado
        [Authorize]
        [HttpGet("verificarSesion")]
        public IActionResult VerificarSesion()
        {
            var token = HttpContext.Request.Headers.Authorization.ToString();
            Console.WriteLine("Token recibido: " + token);
            try
            {
                Console.WriteLine("Verificando sesión...");

                // Imprimir todas las cookies que recibe en la solicitud
                foreach (var cookie in Request.Cookies)
                {
                    Console.WriteLine($"Cookie Name: {cookie.Key}, Cookie Value: {cookie.Value}");
                }

                // Aquí podrías validar más cosas como el token o sesión activa
                // Si llegamos hasta aquí, significa que el usuario está autenticado correctamente
                return Ok(new { mensaje = "Sesión activa" });
            }
            catch (Exception ex)
            {
                // En caso de un error, devolver una respuesta de error
                Console.Error.WriteLine($"Error al verificar sesión: {ex.Message}");
                return StatusCode(500, new { mensaje = "Error al verificar sesión" });
            }
        }


        //Login de usuario
        [HttpPost("login")]
        public ActionResult Login([FromBody] UserLogin_models login)
        {
            // Mensaje genérico para usuario o contraseña incorrectos (mejor seguridad)
            string mensajeError = "Usuario o contraseña incorrectos";

            try
            {
                // 1. Verificar si el usuario existe en la base de datos
                var user = Usuarios_data.UserLogin(login.UserName);

                // 2. Validar si el usuario existe
                if (user == null)
                {
                    return Unauthorized(mensajeError);
                }

                // 3. Verificar el estado del usuario (ej. si está activo)
                if (!user.IsActive)
                {
                    return Unauthorized("Cuenta inactiva. Contacte al administrador.");
                }

                // 4. Comprobar intentos fallidos y bloqueo temporal (Protección contra Brute Force)
                if (user.LoginAttempts >= 5 && user.LockoutEnd > DateTime.UtcNow)
                {
                    return Unauthorized("Cuenta bloqueada temporalmente. Intente más tarde.");
                }

                // 5. Verificar la contraseña usando BCrypt
                if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                {
                    // Incrementar contador de intentos fallidos
                    user.LoginAttempts++;
                    if (user.LoginAttempts >= 5)
                    {
                        user.LockoutEnd = DateTime.UtcNow.AddMinutes(15); // Bloqueo de 15 minutos
                    }
                    _usuariosData.ActualizarIntentos(user.Id, user.LoginAttempts, user.LockoutEnd);

                    return Unauthorized(mensajeError);
                }

                // 6. Reiniciar contador de intentos fallidos
                user.LoginAttempts = 0;
                user.LockoutEnd = null;
                _usuariosData.ActualizarIntentos(user.Id, user.LoginAttempts, user.LockoutEnd);

                // 7. Generar el Access Token y Refresh Token
                var accessToken = _tokenService.GenerarAccessToken(user.Id, user.Role);
                var refreshToken = _tokenService.GenerarRefreshToken();

                // 8. Verificar si existe un Refresh Token activo
                if (_tokenService.RefreshTokenActivo(user.Id))
                {
                    return Unauthorized(new { mensaje = "Sesión ya iniciada en otro dispositivo." });
                }

                // 9. Guardar el Refresh Token en la base de datos
                _tokenService.GuardarRefreshToken(user.Id, refreshToken);

                // 10. Configurar cookies seguras para AccessToken
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,             // No accesible por JavaScript
                    Secure = true,               // Solo en HTTPS
                    SameSite = SameSiteMode.None,  // Permitir que se envíe en solicitudes entre dominios
                    Expires = DateTime.UtcNow.AddMinutes(30) // Expiración del AccessToken
                };
                Response.Cookies.Append("AccessToken", accessToken, cookieOptions);

                // 11. Configurar cookies seguras para RefreshToken
                cookieOptions.Expires = DateTime.UtcNow.AddDays(7);
                Response.Cookies.Append("RefreshToken", refreshToken, cookieOptions);

                // 12. Devolver respuesta exitosa sin exponer los tokens en el body
                return Ok(new { mensaje = "Inicio de sesión exitoso", role = user.Role});

            }
            catch (Exception ex)
            {
                // Manejo de excepciones con log
                _logger.LogError(ex, "Error en el proceso de inicio de sesión");
                return StatusCode(500, "Ocurrió un error inesperado.");
            }
        }

        //Registro de usuario
        [HttpPost("registro")]
        public IActionResult RegistrarUsuario([FromBody] UserRegister_models nuevoUsuario)
        {
            Console.WriteLine($"Password: {nuevoUsuario.Password}");
            // 1. Validar Nombre de Usuario
            if (string.IsNullOrWhiteSpace(nuevoUsuario.UserName))
            {
                return BadRequest(new { success = false, message = "El nombre de usuario es obligatorio." });
            }
            if (!Regex.IsMatch(nuevoUsuario.UserName, @"^[a-zA-Z0-9_]+$"))
            {
                return BadRequest(new { success = false, message = "El nombre de usuario solo puede contener letras, números y guiones bajos." });
            }

            // 3. Validar Contraseña
            if (string.IsNullOrWhiteSpace(nuevoUsuario.Password))
            {
                return BadRequest(new { success = false, message = "La contraseña es obligatoria." });
            }
            if (nuevoUsuario.Password.Length < 8 ||
                !Regex.IsMatch(nuevoUsuario.Password, @"[A-Z]") ||
                !Regex.IsMatch(nuevoUsuario.Password, @"[0-9]") ||
                !Regex.IsMatch(nuevoUsuario.Password, @"[\W]"))
            {
                return BadRequest(new { success = false, message = "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial." });
            }

            // 4. Verificar si el nombre de usuario o email ya existen
            if (Usuarios_data.UserLogin(nuevoUsuario.UserName) != null)
            {
                return Conflict(new { success = false, message = "El nombre de usuario ya está registrado." });
            }

            // 5. Encriptar la contraseña
            string passwordEncriptado = BCrypt.Net.BCrypt.HashPassword(nuevoUsuario.Password);

            // 6. Crear el objeto Usuario con la contraseña encriptada
            UserRegister_models usuarioAGuardar = new()
            {
                Id = Guid.NewGuid().ToString(),
                UserName = nuevoUsuario.UserName,
                Password = passwordEncriptado,
                Role = nuevoUsuario.Role,
                IsActive = true
            };

            Console.WriteLine($"Password: {usuarioAGuardar.Password}");
            // 7. Guardar en la base de datos
            try
            {
                bool resultado = Usuarios_data.RegisterUsuario(usuarioAGuardar);
                if (resultado)
                {
                    // Código exitoso
                    return Ok(new { success = true, message = "Usuario registrado exitosamente." });
                }
                else
                {
                    // Si no se registró
                    return StatusCode(500, new { success = false, message = " Intente nuevamente más tarde." });
                }
            }
            catch (Exception ex)
            {
                // Log de errores detallados
                Console.WriteLine($"Error en el registro: {ex.Message}");
                return StatusCode(500, new { success = false, message = "Hubo un problema al registrar el usuario. Intente nuevamente más tarde." });
            }
        }

        //Renovar Token
        [HttpPost("refreshToken")]
        public IActionResult RefreshToken()
        {
            // 1. Validar formato del Access Token antes de procesarlo
            // Obtener los tokens desde las cookies
            var accessToken = Request.Cookies["AccessToken"];
            var refreshToken = Request.Cookies["RefreshToken"];

            // Verificar si los tokens existen
            if (string.IsNullOrEmpty(accessToken) || string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Tokens no proporcionados.");
            }

            // 2. Obtener datos del Access Token (sin verificar firma)
            var payloadData = TokenService_data.PayloadData(accessToken);
            var userId = payloadData.UserId;
            var role = payloadData.Role;

            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
            {
                return Unauthorized("Access Token inválido.");
            }

            // 3. Validar el Refresh Token contra la base de datos
            TokenData_data tokenData = new();
            if (!tokenData.ValidarRefreshToken(refreshToken, userId))
            {
                return Unauthorized("Refresh Token inválido.");
            }

            // 4. Generar nuevos tokens
            var nuevoAccessToken = _tokenService.GenerarAccessToken(userId, role);
            var nuevoRefreshToken = _tokenService.GenerarRefreshToken();

            // 5. Actualizar el Refresh Token en la base de datos (Invalidar el anterior)
            if (tokenData.ActualizarRefreshToken(refreshToken, nuevoRefreshToken))
            {
                // Configurar cookies
                var cookieOptions = new CookieOptions
                {
                    HttpOnly = true,      // No accesible por JavaScript
                    Secure = true,        // Solo en HTTPS
                    SameSite = SameSiteMode.None,  // Permitir que se envíe en solicitudes entre dominios
                    Expires = DateTime.UtcNow.AddMinutes(2) // Expiración
                };

                // Guardar AccessToken en cookie
                Response.Cookies.Append("AccessToken", nuevoAccessToken, cookieOptions);

                // Guardar RefreshToken en cookie
                cookieOptions.Expires = DateTime.UtcNow.AddDays(7); // Mayor duración para el RefreshToken
                Response.Cookies.Append("RefreshToken", nuevoRefreshToken, cookieOptions);

                return Ok(new { mensaje = "Tokens renovados y almacenados en cookies" });
            }
            else
            {
                return Unauthorized("No se pudo actualizar el Refresh Token.");
            }
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            try
            {
                // 1. Obtener el Refresh Token de las cookies
                var refreshToken = Request.Cookies["RefreshToken"];

                if (string.IsNullOrEmpty(refreshToken))
                {
                    return BadRequest(new { mensaje = "No se encontró un Refresh Token." });
                }

                // 2. Revocar el Refresh Token en la base de datos
                bool revoked = _tokenService.RevocarRefreshToken(refreshToken);

                if (!revoked)
                {
                    return Unauthorized(new { mensaje = "El token ya estaba revocado o no es válido." });
                }

                // 3. Eliminar cookies de sesión
                var expiredCookieOptions = new CookieOptions
                {
                    HttpOnly = true,
                    Secure = true,
                    SameSite = SameSiteMode.None,
                    Expires = DateTime.UtcNow.AddDays(-1) // Fecha de expiración en el pasado
                };

                Response.Cookies.Append("AccessToken", "", expiredCookieOptions);
                Response.Cookies.Append("RefreshToken", "", expiredCookieOptions);

                return Ok(new { mensaje = "Sesión cerrada exitosamente." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error en el cierre de sesión.");
                return StatusCode(500, new { mensaje = "Ocurrió un error al cerrar sesión." });
            }
        }

    }
}
