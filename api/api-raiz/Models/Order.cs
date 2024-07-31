using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required] 
        public Dictionary<Product, int> OrderItems { get; set; }

        public Order() { }

        public Order(int id, Dictionary<Product, int> orderItems)
        {
            Id = id;
            OrderItems = orderItems;
        }
    }
}
