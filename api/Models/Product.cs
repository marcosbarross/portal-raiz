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

        public ICollection<OrderStudentProduct> OrderStudentProducts { get; set; } = new List<OrderStudentProduct>();

        public Product(int id, string name, int size, double price, int remainingAmount)
        {
            Id = id;
            Name = name;
            Size = size;
            Price = price;
            RemainingAmount = remainingAmount;
            SoldAmount = 0;
        }

        public string intToString(int size_int)
        {
            switch (size_int)
            {
                case 18:
                    return "pp";
                case 20:
                    return "p";
                case 22:
                    return "m";
                case 24:
                    return "g";
                case 26:
                    return "gg";
                default:
                    return "erro";
            }
        }
    }

    public class ProductAlternativeSize
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Size { get; set; }
        public double Price { get; set; }
        public int RemainingAmount { get; set; }
        public int SoldAmount { get; set; }

        public ProductAlternativeSize(Product product)
        {
            Id = product.Id;
            Name = product.Name;
            Size = product.intToString(product.Size);
            Price = product.Price;
            RemainingAmount = product.RemainingAmount;
            SoldAmount = product.SoldAmount;
        }
    }

    public class ProductResponse
    {
        public List<Product> Products { get; set; }
        public List<ProductAlternativeSize> ProductsAlternativeSize { get; set; }
    }
}
