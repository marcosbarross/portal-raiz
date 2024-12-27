using api_raiz.Dtos.StudentsDto;

namespace api_raiz.Data;

public class EventDetailsDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Installments { get; set; }
    public int GroupId { get; set; }
    public DateTime Date { get; set; }
    public Double TotalPrice { get; set; }
    public List<StudentDto> Students { get; set; }
}