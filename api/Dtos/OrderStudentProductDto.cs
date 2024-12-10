using api_raiz.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Dtos
{
    public class OrderStudentProductDto
    {
        [ForeignKey("OrderId")]
        public int OrderId { get; set; }
        public Order Order { get; set; }

        [ForeignKey("StudentId")]
        public int StudentId { get; set; }
        public Student Student { get; set; }

        [ForeignKey("ProductId")]
        public int ProductId { get; set; }
        public Product Product { get; set; }

        [Required]
        public int ProductQuantity { get; set; }

        [Required]
        public DateTime Date { get; set; }
        public bool IsDelivered { get; set; }


        public OrderStudentProductDto(int orderId, int studentId, int productId, int productQuantity, DateTime date, bool isDelivered)
        {
            OrderId = orderId;
            StudentId = studentId;
            ProductId = productId;
            ProductQuantity = productQuantity;
            Date = date;
            IsDelivered = isDelivered;
        }
    }
}
