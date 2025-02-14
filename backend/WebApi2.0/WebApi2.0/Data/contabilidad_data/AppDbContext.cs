using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using WebApi2._0.models.contabilidad;

namespace WebApi2._0.Data.contabilidad_data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {

        // Definir las tablas en la base de datos
        public DbSet<Cuentas_models> Cuenta { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Cuentas_models>().HasNoKey(); // Indicar que esta entidad no tiene clave primaria
        }
    }
}
