using WebApi2._0.models.biblioteca;
using Microsoft.EntityFrameworkCore;

namespace WebApi2._0.Data.bibioteca_data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Autor_models> Autores { get; set; }
        public DbSet<Libro_models> Libros { get; set; }
        public DbSet<Prestamo_models> Prestamos { get; set; }
        public DbSet<DetallePrestamo_model> DetallePrestamos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Libro_models>()
                .HasOne(libro => libro.Autor)
                .WithMany()
                .HasForeignKey(libro => libro.AutorCodigo);

            modelBuilder.Entity<DetallePrestamo_model>()
                .HasOne(prestamo => prestamo.Libro)
                .WithMany()
                .HasForeignKey(prestamo => prestamo.CodigoLibro);
        }
    }
}
