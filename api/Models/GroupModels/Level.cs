using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models.GroupModels
{
    public class Level
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public ICollection<Grade> Grades { get; set; } = new List<Grade>();
        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
