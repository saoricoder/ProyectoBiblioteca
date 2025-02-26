using System.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using WebApi3.Models.User_models;

namespace WebApi3.Data.User_data
{
    public class Usuarios_data
    {
        private static readonly string baseDatos = "DBWEBAPI";

        public static bool RegisterUsuario (UserRegister_models usuarios)
        {

            Console.WriteLine($"PasswordRegister: {usuarios.Password}");
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "INSERT INTO usuarios (Id,UserName,Password, Role,IsActive ) VALUES (@Id,@UserName,@Password, @Role,@IsActive)";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@Id", usuarios.Id);
            comando.Parameters.AddWithValue("@UserName", usuarios.UserName);
            comando.Parameters.AddWithValue("@Password", usuarios.Password);
            comando.Parameters.AddWithValue("@Role", usuarios.Role);
            comando.Parameters.AddWithValue("@IsActive", usuarios.IsActive);
            try
            {
                comando.ExecuteNonQuery();
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine("error" + ex);
                return false;
            }
        }

        public static UserRegister_models? UserLogin(string username)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();
            string query = "SELECT * FROM usuarios WHERE UserName = @username";
            SqlCommand comando = new(query, conexion);
            comando.Parameters.AddWithValue("@username", username);
            SqlDataReader reader = comando.ExecuteReader();
            UserRegister_models usuario = new();
            if (reader.Read())
            {
                return new UserRegister_models
                {
                    Id = reader.GetString(0),
                    UserName = reader.GetString(1),
                    Password = reader.GetString(2),
                    Role = reader.GetString(3),
                    LoginAttempts = reader.GetInt32(4),
                    LockoutEnd = reader.IsDBNull("LockoutEnd") ? (DateTime?)null : reader.GetDateTime("LockoutEnd"),
                    IsActive = reader.GetBoolean(6),
                };
            }
            return null; // Retorna null si no encuentra el usuario
        }

        public void ActualizarIntentos(string userId, int intentosFallidos, DateTime? lockoutEnd)
        {
            using SqlConnection conexion = ConnGeneral.ObtenerConexion(baseDatos);
            conexion.Open();

            string query = @"
        UPDATE Usuarios 
        SET LoginAttempts = @LoginAttempts, 
            LockoutEnd = @LockoutEnd 
        WHERE Id = @UserId";

            using SqlCommand cmd = new(query, conexion);
            cmd.Parameters.AddWithValue("@UserId", userId);
            cmd.Parameters.AddWithValue("@LoginAttempts", intentosFallidos);
            cmd.Parameters.AddWithValue("@LockoutEnd", lockoutEnd ?? (object)DBNull.Value);

            cmd.ExecuteNonQuery();
        }


    }
}
