using Microsoft.EntityFrameworkCore;
using api_raiz.Models;

namespace api_raiz.Data
{
    public class Context : DbContext
    {
        public Context(DbContextOptions<Context> options) : base(options) { }
        //public Context() { }

        public DbSet<Product> Products { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<Group> Groups { get; set; }
        public DbSet<Event> Events { get; set; }
        public DbSet<EventStudent> EventStudents { get; set; }

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
    }
}