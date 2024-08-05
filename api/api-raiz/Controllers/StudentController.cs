using api_raiz.Data;
using api_raiz.Models;
using Microsoft.AspNetCore.Mvc;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        [HttpGet("GetStudents")]
        public IActionResult GetStudents()
        {
            using (var context = new Context())
            {
                var students = context.Students.ToList();
                return Ok(students);
            }
        }

        [HttpPost("AddStudentToEvent")]
        public IActionResult AddStudentToEvent([FromBody] StudentEventDto studentEventDto)
        {
            using (var context = new Context())
            {
                var existingStudent = context.Students.FirstOrDefault(s => s.Registration == studentEventDto.Registration);
                if (existingStudent == null)
                {
                    var student = new Student
                    {
                        Name = studentEventDto.Name,
                        Responsible = studentEventDto.Responsible
                    };
                    context.Students.Add(student);
                    context.SaveChanges();
                    studentEventDto.Registration = student.Registration;
                }
                else
                {
                    studentEventDto.Registration = existingStudent.Registration;
                }

                // Verificar se a relação aluno-evento já existe
                var existingEventStudent = context.EventStudents.FirstOrDefault(es => es.EventId == studentEventDto.EventId && es.StudentId == studentEventDto.Registration);
                if (existingEventStudent != null)
                {
                    return Conflict(new { message = "Aluno já registrado no evento." });
                }

                var eventStudent = new EventStudent
                {
                    EventId = studentEventDto.EventId,
                    StudentId = studentEventDto.Registration
                };

                context.EventStudents.Add(eventStudent);
                context.SaveChanges();

                return Ok();
            }
        }

    }
}