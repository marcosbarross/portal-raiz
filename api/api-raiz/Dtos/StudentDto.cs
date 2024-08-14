using api_raiz.Models;

namespace api_raiz.Data;
using System.ComponentModel.DataAnnotations;

public class StudentDto
{
    public int Registration { get; set; }
    [Required]
    public string Name { get; set; }
    
    public string Responsible { get; set; }
    [Required]
    public int GroupId { get; set; }
    
    public StudentDto (Student student)
    {
        Registration = student.Registration;
        Name = student.Name;
        Responsible = student.Responsible;
        GroupId = student.GroupId;
    }
    
    public StudentDto(){}
    public StudentDto(string name, string responsible)
    {
        Name = name;
        Responsible = responsible;
    }
}