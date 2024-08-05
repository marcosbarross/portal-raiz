namespace api_raiz.Data;
using System.ComponentModel.DataAnnotations;

public class StudentDto
{
    public int Registration { get; set; }
    public string Name { get; set; }
    
    public string Responsible { get; set; }
    
    public StudentDto(){}
    public StudentDto(string name, string responsible)
    {
        Name = name;
        Responsible = responsible;
    }
}