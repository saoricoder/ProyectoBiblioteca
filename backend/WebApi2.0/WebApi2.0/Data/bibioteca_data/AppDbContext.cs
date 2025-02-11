//using WebApi2._0.Data.contabilidad_data;
using WebApi2._0.models.biblioteca;

public class AppDbContext : DbContext
{
    public DbSet<Autor> Autores { get; set; }
    public DbSet<Libro> Libros { get; set; }
    public DbSet<Prestamo> Prestamos { get; set; }
    public DbSet<DetallePrestamo> DetallePrestamos { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Libro>()
            .HasOne(l => l.Autor)
            .WithMany()
            .HasForeignKey(l => l.AutorCodigo);

        modelBuilder.Entity<DetallePrestamo>()
            .HasOne(d => d.Libro)
            .WithMany()
            .HasForeignKey(d => d.CodigoLibro);
    }
}