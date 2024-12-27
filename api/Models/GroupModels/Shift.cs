using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models.GroupModels
{
    public class Shift
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        public ICollection<Group> Groups { get; set; } = new List<Group>();
    }
}
