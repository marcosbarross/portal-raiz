using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using api_raiz.Models;
using Microsoft.AspNetCore.Identity;
using api_raiz.Models.Relationships;
using api_raiz.Models.GroupModels;

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
        public DbSet<GeneralEventStudentsInstallments> GeneralEventStudentsInstallments { get; set; }
        public DbSet<EventStudent> EventStudents { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderStudentProduct> OrderStudentProducts { get; set; }
        public DbSet<Shift> Shifts { get; set; }
        public DbSet<Grade> Grades { get; set; }
        public DbSet<Level> Levels { get; set; }

        public Context() { }

        public Context(DbContextOptions<Context> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            var host = Environment.GetEnvironmentVariable("DB_HOST");
            var port = Environment.GetEnvironmentVariable("DB_PORT");
            var database = Environment.GetEnvironmentVariable("DB_NAME");
            var username = Environment.GetEnvironmentVariable("DB_USER");
            var password = Environment.GetEnvironmentVariable("DB_PASSWORD");

            /*
            var host = "localhost";
            var port = "5432";
            var database = "portal_raiz";
            var username = "postgres";
            var password = "root";
            */
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

            modelBuilder.Entity<GeneralEventStudentsInstallments>()
                .HasKey(gei => new { gei.EventId, gei.StudentId, gei.InstallmentNumber });

            modelBuilder.Entity<GeneralEventStudentsInstallments>()
                .HasOne(gei => gei.GeneralEvent)
                .WithMany(ge => ge.GeneralEventStudentsInstallments)
                .HasForeignKey(gei => gei.EventId);

            modelBuilder.Entity<GeneralEventStudentsInstallments>()
                .HasOne(gei => gei.Student)
                .WithMany(s => s.GeneralEventStudentsInstallments)
                .HasForeignKey(gei => gei.StudentId);

            modelBuilder.Entity<OrderStudentProduct>()
                .HasKey(osp => new { osp.OrderId, osp.StudentId, osp.ProductId });

            modelBuilder.Entity<OrderStudentProduct>()
                .HasOne(osp => osp.Order)
                .WithMany(o => o.OrderStudentProducts)
                .HasForeignKey(osp => osp.OrderId);

            modelBuilder.Entity<OrderStudentProduct>()
                .HasOne(osp => osp.Student)
                .WithMany(s => s.OrderStudentProducts)
                .HasForeignKey(osp => osp.StudentId);

            modelBuilder.Entity<OrderStudentProduct>()
                .HasOne(osp => osp.Product)
                .WithMany(p => p.OrderStudentProducts)
                .HasForeignKey(osp => osp.ProductId);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Shift)
                .WithMany(s => s.Groups)
                .HasForeignKey(g => g.ShiftId);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Grade)
                .WithMany(gr => gr.Groups)
                .HasForeignKey(g => g.GradeId);

            modelBuilder.Entity<Group>()
                .HasOne(g => g.Level)
                .WithMany(l => l.Groups)
                .HasForeignKey(g => g.LevelId);

            modelBuilder.Entity<Grade>()
                .HasOne(g => g.Level)
                .WithMany(l => l.Grades)
                .HasForeignKey(g => g.LevelId);
        }
    }
}
