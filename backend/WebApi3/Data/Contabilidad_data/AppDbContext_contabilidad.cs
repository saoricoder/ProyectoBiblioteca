using Microsoft.EntityFrameworkCore;
using WebApi3.Models.Contabilidad_models;

namespace WebApi3.Data.Contabilidad_data
{
    public class AppDbContext_contabilidad(DbContextOptions<AppDbContext_contabilidad> options) : DbContext(options)
    {
        // Definir las tablas en la base de datos
        public DbSet<Cuentas_models> Cuenta { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cuentas_models>().HasNoKey(); // Indicar que esta entidad no tiene clave primaria
        }
    }
}
