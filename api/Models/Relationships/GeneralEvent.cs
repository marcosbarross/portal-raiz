using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api_raiz.Models.Relationships
{
    public class GeneralEvent
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public int Installments { get; set; }

        [Required]
        public DateTime Date { get; set; }

        [Required]
        public double TotalPrice { get; set; }

        public ICollection<GeneralEventStudent> GeneralEventStudents { get; set; } = new List<GeneralEventStudent>();

        public ICollection<GeneralEventStudentsInstallments> GeneralEventStudentsInstallments { get; set; } = new List<GeneralEventStudentsInstallments>();

        public GeneralEvent() { }
    }
}
