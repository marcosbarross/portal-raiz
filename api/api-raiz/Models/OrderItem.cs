using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models
{
    public class OrderItem
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public int ProductId { get; set; }
        public Product Product { get; set; }
        [Required]
        public int OrderId { get; set; }
        public Order Order { get; set; }
        [Required]
        public int Quantity { get; set; }
    }
}
