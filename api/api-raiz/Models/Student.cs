using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using api_raiz.Data;

namespace api_raiz.Models
{
    public class Student
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Registration { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Responsible { get; set; }

        public ICollection<EventStudent> EventStudents { get; set; } = new List<EventStudent>();

        public Student()
        {
            
        }
        
        public Student(StudentDto studentDTO)
        {
            Name = studentDTO.Name;
            Responsible = studentDTO.Responsible;
        }
    }
}