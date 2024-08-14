using Microsoft.EntityFrameworkCore;
using api_raiz.Models;

namespace api_raiz.Data
{
    public class Context : DbContext
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventStudent> EventStudents { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var host = Environment.GetEnvironmentVariable("DB_HOST");
            var port = Environment.GetEnvironmentVariable("DB_PORT");
            var database = Environment.GetEnvironmentVariable("DB_NAME");
            var username = Environment.GetEnvironmentVariable("DB_USER");
            var password = Environment.GetEnvironmentVariable("DB_PASSWORD");

            var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";
            optionsBuilder.UseNpgsql(connectionString);
            
            //optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=portal_raiz;Username=postgres;Password=root;");
        }
        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<EventStudent>()
                .HasKey(es => new { es.EventId, es.StudentId });

            modelBuilder.Entity<EventStudent>()
                .HasOne(es => es.Event)
                .WithMany(e => e.EventStudents)
                .HasForeignKey(es => es.EventId);

            modelBuilder.Entity<EventStudent>()
                .HasOne(es => es.Student)
                .WithMany(s => s.EventStudents)
                .HasForeignKey(es => es.StudentId);
            
            modelBuilder.Entity<Student>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId);
        }


        public Context() { }
    }
}