using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api_raiz.Models
{
    public class GeneralEventStudentsInstallments
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("GeneralEventId")]
        public int EventId { get; set; }

        [ForeignKey("StudentId")]
        public int StudentId { get; set; }

        [Required]
        public int InstallmentNumber { get; set; }

        [Required]
        public DateTime PayDate { get; set; }

        public GeneralEvent GeneralEvent { get; set; }
        public Student Student { get; set; }
    }
}
