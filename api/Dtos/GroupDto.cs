using api_raiz.Models;

namespace api_raiz.Data;

public class GroupDto
{
    public int id { get; set; }
    public string name { get; set; }
    public int levelId { get; set; }
    public int shiftId { get; set; }
    public int gradeId { get; set; }
    
}