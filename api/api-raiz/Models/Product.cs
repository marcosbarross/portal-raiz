using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public int Size { get; set; }
        [Required]
        public double Price { get; set; }
        public int RemainingAmount { get; set; }
        public int SoldAmount { get; set; }

        public Product(int id, string name, int size, double price, int remainingAmount)
        {
            Id = id;
            Name = name;
            Size = size;
            Price = price;
            RemainingAmount = remainingAmount;
            SoldAmount = 0;
        }
    }
}
