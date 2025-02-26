using Microsoft.EntityFrameworkCore;
using WebApi3.Data.Biblioteca_data;
using WebApi3.Data.Contabilidad_data;
using WebApi3.Hubs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using WebApi3.Data.Token_data;
using WebApi3.Data.User_data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agrega TokenData y TokenService al contenedor
builder.Services.AddSingleton<TokenData_data>();
builder.Services.AddSingleton<TokenService_data>();
// Configuraci�n de autenticaci�n JWT para leer desde la cookie
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.Events = new JwtBearerEvents
    {
        // Este evento se dispara cuando el servidor recibe una solicitud
        // y no hay un token en el encabezado Authorization.
        OnMessageReceived = context =>
        {
            // Verifica si hay un token en las cookies
            var token = context.Request.Cookies["AccessToken"];

            // Si existe el token en la cookie, lo agregamos al encabezado Authorization
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Autenticaci�n fallida: " + context.Exception.Message);
            return Task.CompletedTask;
        }
    };

    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

// Agregar SignalR al contenedor de servicios
builder.Services.AddSignalR();
// Cache
builder.Services.AddMemoryCache();

builder.Services.AddControllers();
// Configuraci?n de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuracion de SQL Server
builder.Services.AddDbContext<AppDbContext_contabilidad>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ContabilidadConnection")));
builder.Services.AddDbContext<AppDbContext_biblioteca>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BibliotecaConnection")));

// Configuracion de CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", builder =>
    {
        builder.WithOrigins("http://localhost:3000")  // Permitir solo este origen
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();  // Habilitar credenciales
    });
});



var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Configurar los endpoints de SignalR **antes** de UseRouting
app.UseRouting();

//Registrar politicas de cors
app.UseCors("MyPolicy");

// Middleware de autenticaci�n y autorizaci�n
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
// Registrar el Hub de SignalR
app.MapHub<ChatHub>("/chatHub");

app.Run();