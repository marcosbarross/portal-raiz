using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

namespace api_raiz.Models.GroupModels;

[Route("/")]
public class Group
{
    [Key]
    public int id { get; set; }

    [Required]
    public string name { get; set; }

    [Required]
    public string level { get; set; }

    [Required]
    public string shift { get; set; }

    public ICollection<Student> Students { get; set; } = new List<Student>();

    public Group() { }

    public Group(string name, string level)
    {
        this.name = name;
        this.level = level;
    }
}
