using api_raiz.Models;

namespace api_raiz.Data;

public class GroupDto
{
    public int id { get; set; }
    public string name { get; set; }
    public string level { get; set; }
    public string shift { get; set; }
    public ICollection<Student> Students { get; set; }
    
}