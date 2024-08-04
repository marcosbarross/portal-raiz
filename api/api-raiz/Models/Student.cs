using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models
{
    public class Student
    {
        [Key]
        public int Registration { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Responsible { get; set; }

        public ICollection<EventStudent> EventStudents { get; set; } = new List<EventStudent>();
    }
}