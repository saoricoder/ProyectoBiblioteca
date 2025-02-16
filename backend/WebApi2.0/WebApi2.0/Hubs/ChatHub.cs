using System.Collections.Concurrent;
using Microsoft.AspNetCore.SignalR;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace WebApi2._0.Hubs
{
    public class ChatHub : Hub
    {
        //Grupos de usuarios
        //Diccionario para almacenar los ConnectionId asociados a un nombre de usuario
        private static readonly ConcurrentDictionary<string, string> _userConnections = new();

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var isAdmin = httpContext?.Request.Query["IsAdmin"];
            var userName = httpContext?.Request.Query["UserName"];
            // Log para depurar
            Console.WriteLine($"Conexión recibida - IsAdmin: {isAdmin}, UserName: {userName}");

            if (!string.IsNullOrEmpty(userName))
            {
                _userConnections[userName] = Context.ConnectionId ??  throw new ArgumentNullException(nameof(Context.ConnectionId));

                if (isAdmin.HasValue && isAdmin.Value == "true")
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Admins");
                    await Clients.Caller.SendAsync("ReceiveMessage", "Servidor", $"👑 Bienvenido admin: {userName}");
                }
                else
                {
                    await Groups.AddToGroupAsync(Context.ConnectionId, "Users");
                    await Clients.Caller.SendAsync("ReceiveMessage", "Servidor", $"👋 Bienvenido usuario: {userName}");
                }
            }

            await base.OnConnectedAsync();
        }


        public async Task? SendMessageToAdmins(string user, string message)
        {
            Console.WriteLine($"📩 Mensaje recibido en el servidor de {user}: {message}");
            await Clients.Group("Admins").SendAsync("ReceiveMessage", user, message);
            if (_userConnections.TryGetValue(user, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", user, message);
            }
        }

        public async Task? SendMessageToUser(string targetUser, string message)
        {
            if (_userConnections.TryGetValue(targetUser, out var connectionId))
            {
                await Clients.Client(connectionId).SendAsync("ReceiveMessage", "Admin", message);
            }
            else
            {
                await Clients.Caller.SendAsync("ReceiveMessage", "Servidor", $"El usuario {targetUser} no está disponible.");
            }
        }
    }
}
