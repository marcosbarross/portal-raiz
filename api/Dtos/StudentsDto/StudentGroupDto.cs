using api_raiz.Models;
namespace api_raiz.Dtos.StudentsDto;

public class StudentGroupDto
{
    public int Registration { get; set; }
    public string Name { get; set; }
    public string Responsible { get; set; }
    public int GroupId { get; set; }
    public string GroupName { get; set; }

    public StudentGroupDto(Student student)
    {
        Registration = student.Registration;
        Name = student.Name;
        Responsible = student.Responsible;
        GroupId = student.GroupId;
    }

    public StudentGroupDto()
    {

    }
}