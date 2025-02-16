using Microsoft.EntityFrameworkCore;
using WebApi3.Models.Biblioteca_models;

namespace WebApi3.Data.Biblioteca_data
{
    public class AppDbContext_biblioteca(DbContextOptions<AppDbContext_biblioteca> options) : DbContext(options)
    {
        public DbSet<Autores_models> Autores { get; set; }
        public DbSet<Libros_models> Libros { get; set; }
        public DbSet<Prestamos_models> Prestamos { get; set; }
        public DbSet<DetallePrestamos_models> DetallePrestamos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Libros_models>()
                .HasOne(libro => libro.Autor)
                .WithMany()
                .HasForeignKey(libro => libro.AutorCodigo);

            modelBuilder.Entity<DetallePrestamos_models>()
                .HasOne(prestamo => prestamo.Libro)
                .WithMany()
                .HasForeignKey(prestamo => prestamo.CodigoLibro);
        }
    }
}
