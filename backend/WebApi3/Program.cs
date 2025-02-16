using System;
using Microsoft.EntityFrameworkCore;
using WebApi3.Data.Biblioteca_data;
using WebApi3.Data.Contabilidad_data;
using WebApi3.Hubs;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agregar SignalR al contenedor de servicios
builder.Services.AddSignalR();
// Cache
builder.Services.AddMemoryCache();

builder.Services.AddControllers();
// Configuraci?n de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuraci?n de SQL Server
builder.Services.AddDbContext<AppDbContext_contabilidad>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("ContabilidadConnection")));
builder.Services.AddDbContext<AppDbContext_biblioteca>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BibliotecaConnection")));

// Configuraci?n de CORS
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

app.UseAuthorization();

app.MapControllers();
// Registrar el Hub de SignalR
app.MapHub<ChatHub>("/chatHub");

app.Run();