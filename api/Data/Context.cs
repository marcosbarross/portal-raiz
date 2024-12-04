using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using api_raiz.Models;
using Microsoft.AspNetCore.Identity;

namespace api_raiz.Data
{
    public class Context : IdentityDbContext<IdentityUser>
    {
        public DbSet<Product> Products { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<GeneralEvent> GeneralEvents { get; set; }
        public DbSet<GeneralEventStudent> GeneralEventStudents { get; set; }
        public DbSet<EventStudent> EventStudents { get; set; }

        public Context() { }

        public Context(DbContextOptions<Context> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {   
            /*
            var host = Environment.GetEnvironmentVariable("DB_HOST");
            var port = Environment.GetEnvironmentVariable("DB_PORT");
            var database = Environment.GetEnvironmentVariable("DB_NAME");
            var username = Environment.GetEnvironmentVariable("DB_USER");
            var password = Environment.GetEnvironmentVariable("DB_PASSWORD");
            */

            var host = "localhost";
            var port = "5432";
            var database = "portal_raiz";
            var username = "postgres";
            var password = "root";


            var connectionString = $"Host={host};Port={port};Database={database};Username={username};Password={password}";
            optionsBuilder.UseNpgsql(connectionString);
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

            modelBuilder.Entity<GeneralEventStudent>()
                .HasKey(ges => new { ges.GeneralEventId, ges.StudentId });

            modelBuilder.Entity<GeneralEventStudent>()
                .HasOne(ges => ges.GeneralEvent)
                .WithMany(ge => ge.GeneralEventStudents)
                .HasForeignKey(ges => ges.GeneralEventId);

            modelBuilder.Entity<GeneralEventStudent>()
                .HasOne(ges => ges.Student)
                .WithMany(s => s.GeneralEventStudents)
                .HasForeignKey(ges => ges.StudentId);

            modelBuilder.Entity<Student>()
                .HasOne(s => s.Group)
                .WithMany(g => g.Students)
                .HasForeignKey(s => s.GroupId);
        }
    }
}
