using Microsoft.EntityFrameworkCore;
using WebApi2._0.Data.biblioteca_data;
using WebApi2._0.Data.contabilidad_data;
using WebApi2._0.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Agregar SignalR al contenedor de servicios
builder.Services.AddSignalR();
// Cache
builder.Services.AddMemoryCache();

builder.Services.AddControllers();
// Configuración de Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configuración de SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<AppDbContextBiblioteca>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("BibliotecaConnection")));

// Configuración de CORS
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
