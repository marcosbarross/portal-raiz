using api_raiz.Models;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using api_raiz.Models.Relationships;

public class GeneralEventStudent
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int GeneralEventId { get; set; }

    [ForeignKey("GeneralEventId")]
    public GeneralEvent GeneralEvent { get; set; }

    [Required]
    public int StudentId { get; set; }

    [ForeignKey("StudentId")]
    public Student Student { get; set; }

    [Required]
    public int PaidInstallments { get; set; } = 0;
}
