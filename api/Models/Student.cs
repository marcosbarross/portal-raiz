using api_raiz.Dtos.StudentsDto;
using api_raiz.Models.GroupModels;
using api_raiz.Models.Relationships;
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
        [ForeignKey("GroupId")]
        public Group Group { get; set; }

        public ICollection<GeneralEventStudent> GeneralEventStudents { get; set; } = new List<GeneralEventStudent>();

        public ICollection<GeneralEventStudentsInstallments> GeneralEventStudentsInstallments { get; set; } = new List<GeneralEventStudentsInstallments>();

        public ICollection<EventStudent> EventStudents { get; set; } = new List<EventStudent>();

        public ICollection<OrderStudentProduct> OrderStudentProducts { get; set; } = new List<OrderStudentProduct>();

        public Student() { }

        public Student(StudentDto studentDTO)
        {
            Name = studentDTO.Name;
            Responsible = studentDTO.Responsible;
        }
    }
}
