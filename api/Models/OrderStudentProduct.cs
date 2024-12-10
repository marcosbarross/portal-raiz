using api_raiz.Dtos;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_raiz.Models
{
    public class OrderStudentProduct
    {
        [Key]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public Order Order { get; set; }

        public int StudentId { get; set; }

        [ForeignKey("StudentId")]
        public Student Student { get; set; }

        public int ProductId { get; set; }

        [ForeignKey("ProductId")]
        public Product Product { get; set; }

        [Required]
        public int ProductQuantity { get; set; }

        [Required]
        public DateTime Date { get; set; }
        public bool IsDelivered { get; set; }

        public OrderStudentProduct() { }

        public OrderStudentProduct(OrderStudentProductDto orderStudentProductDto, bool isDelivered)
        {
            OrderId = orderStudentProductDto.OrderId;
            StudentId = orderStudentProductDto.StudentId;
            ProductId = orderStudentProductDto.ProductId;
            ProductQuantity = orderStudentProductDto.ProductQuantity;
            Date = orderStudentProductDto.Date;
            IsDelivered = isDelivered;
        }

        public OrderStudentProduct(OrderDto orderDto, bool isDelivered)
        {
            OrderId = orderDto.Id;
            StudentId = orderDto.StudentId;
            ProductId = orderDto.ProductId;
            ProductQuantity = orderDto.ProductQuantity;
            Date = orderDto.Date;
            IsDelivered = isDelivered;
        }
    }
}
