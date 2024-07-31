using Microsoft.EntityFrameworkCore;
using api_raiz.Models;

namespace api_raiz.Data
{
    public class Context : DbContext
    {
        public DbSet<Product> Products { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseNpgsql("Server=localhost;Port=5432;Database=portal_raiz;Username=postgres;Password=root;");
        }

        public Context() { }
        
    }
}
