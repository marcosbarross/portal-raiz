using api_raiz.Dtos;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_raiz.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("StudentId")]
        public int StudentId { get; set; }
        public int Identificator { get; set; }

        public Order(OrderDto orderDto)
        {
            StudentId = orderDto.StudentId;
            Identificator = orderDto.Identificator;
        }
        public Order() { }

        public ICollection<OrderStudentProduct> OrderStudentProducts { get; set; } = new List<OrderStudentProduct>();
    }
}


