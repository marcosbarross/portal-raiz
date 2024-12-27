using System.ComponentModel.DataAnnotations;
using api_raiz.Data;
using Microsoft.AspNetCore.Mvc;

namespace api_raiz.Models.GroupModels
{
    [Route("/")]
    public class Group
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int ShiftId { get; set; }
        public Shift Shift { get; set; }

        [Required]
        public int GradeId { get; set; }
        public Grade Grade { get; set; }

        [Required]
        public int LevelId { get; set; }
        public Level Level { get; set; }

        public ICollection<Student> Students { get; set; } = new List<Student>();

        public Group() { }

        public Group(string name, int shiftId, int gradeId, int levelId)
        {
            Name = name;
            ShiftId = shiftId;
            GradeId = gradeId;
            LevelId = levelId;
        }

        public Group(GroupDto groupDto)
        {
            Name = groupDto.name;
            ShiftId = groupDto.shiftId;
            LevelId = groupDto.levelId;
            GradeId = groupDto.gradeId;
        }
    }
}
