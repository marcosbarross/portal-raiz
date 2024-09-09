using api_raiz.Data;
using api_raiz.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private readonly Context _context;

        public StudentController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetStudents")]
        public IActionResult GetStudents()
        {
            var students = _context.Students.ToList();
            return Ok(students);
        }

        [HttpPost("AddStudent")]
        public IActionResult AddStudent([FromBody] StudentDto studentDto)
        {
            var group = _context.Groups.Find(studentDto.GroupId);
            if (group == null)
            {
                return BadRequest(new { message = "Grupo não encontrado." });
            }

            var student = new Student
            {
                Name = studentDto.Name,
                Responsible = studentDto.Responsible,
                GroupId = studentDto.GroupId
            };

            _context.Students.Add(student);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost("AddStudentToEvent")]
        public IActionResult AddStudentToEvent([FromBody] StudentEventDto studentEventDto)
        {
            var existingStudent = _context.Students.FirstOrDefault(s => s.Registration == studentEventDto.Registration);
            if (existingStudent == null)
            {
                var student = new Student
                {
                    Name = studentEventDto.Name,
                    Responsible = studentEventDto.Responsible
                };
                _context.Students.Add(student);
                _context.SaveChanges();
                studentEventDto.Registration = student.Registration;
            }
            else
            {
                studentEventDto.Registration = existingStudent.Registration;
            }

            var existingEventStudent = _context.EventStudents
                .FirstOrDefault(es => es.EventId == studentEventDto.EventId && es.StudentId == studentEventDto.Registration);

            if (existingEventStudent != null)
            {
                return Conflict(new { message = "Aluno já registrado no evento." });
            }

            var eventStudent = new EventStudent
            {
                EventId = studentEventDto.EventId,
                StudentId = studentEventDto.Registration
            };

            _context.EventStudents.Add(eventStudent);
            _context.SaveChanges();

            return Ok();
        }

        [HttpGet("GetStudentParcelas/{studentId}")]
        public IActionResult GetStudentParcelas(int studentId)
        {
            var eventStudents = _context.EventStudents
                .Where(es => es.StudentId == studentId)
                .Select(es => new InstallmentDto
                {
                    EventId = es.EventId,
                    StudentId = es.StudentId,
                    TotalInstallments = es.Event.Installments,
                    PaidInstallments = es.PaidInstallments,
                })
                .ToList();

            if (eventStudents == null || eventStudents.Count == 0)
            {
                return NotFound(new { message = "Parcelas não encontradas para o aluno." });
            }

            var installments = new List<InstallmentDetailDto>();
            foreach (var eventStudent in eventStudents)
            {
                for (int i = 1; i <= eventStudent.TotalInstallments; i++)
                {
                    installments.Add(new InstallmentDetailDto
                    {
                        InstallmentNumber = i,
                        Paid = i <= eventStudent.PaidInstallments,
                        EventId = eventStudent.EventId,
                        StudentId = eventStudent.StudentId
                    });
                }
            }

            return Ok(installments);
        }

        [HttpPost("PagarParcelas")]
        public IActionResult PagarParcelas([FromBody] List<InstallmentDetailDto> installmentDetails)
        {
            foreach (var installment in installmentDetails)
            {
                var eventStudent = _context.EventStudents
                    .FirstOrDefault(es => es.EventId == installment.EventId && es.StudentId == installment.StudentId);

                if (eventStudent != null)
                {
                    if (installment.InstallmentNumber > eventStudent.PaidInstallments)
                    {
                        eventStudent.PaidInstallments = installment.InstallmentNumber;
                    }
                }
            }

            _context.SaveChanges();
            return Ok(new { message = "Parcelas pagas com sucesso." });
        }

        [HttpPost("GetStudentGroupNameByStudentId")]
        public IActionResult GetStudentGroupNameByStudentId([FromBody] List<int> studentsIds)
        {
            var studentGroup = new List<StudentGroupDto>();
            foreach (var studentId in studentsIds)
            {
                var studentDto = _context.Students.Find(studentId);
                if (studentDto != null)
                {
                    var student = new StudentGroupDto(studentDto);
                    var group = _context.Groups.Find(studentDto.GroupId);
                    if (group != null)
                    {
                        student.GroupName = group.name;
                        studentGroup.Add(student);
                    }
                }
            }
            return Ok(studentGroup);
        }
    }
}
