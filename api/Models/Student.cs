using api_raiz.Data;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public int GroupId { get; set; }
        [ForeignKey("id")]
        public Group Group { get; set; }

        public ICollection<GeneralEventStudent> GeneralEventStudents { get; set; } = new List<GeneralEventStudent>();
        public ICollection<EventStudent> EventStudents { get; set; } = new List<EventStudent>();

        public Student() { }

        public Student(StudentDto studentDTO)
        {
            Name = studentDTO.Name;
            Responsible = studentDTO.Responsible;
        }
    }
}
