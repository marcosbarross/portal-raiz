﻿using Microsoft.AspNetCore.Mvc;
using api_raiz.Data;
using api_raiz.Models;
using api_raiz.Dtos;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http.HttpResults;
using api_raiz.Models.Relationships;
using api_raiz.Dtos.StudentsDto;
using api_raiz.Dtos.InstallmentsDto;

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

        [HttpGet("GetStudentName/{studentId}")]
        public IActionResult GetStudentName(int studentId)
        {
            using (var context = new Context())
            {
                var student = context.Students.Find(studentId);

                if (student == null)
                {
                    return NotFound(new { message = "Estudante não encontrado." });
                }

                string nameJson = "{ \"name\": \"" + student.Name + "\" }";


                return Ok(nameJson);
            }
        }


        [HttpGet("GetGeneralEventInstallments/{studentId}/{generalEventId}")]
        public IActionResult GetGeneralEventInstallments(int studentId, int generalEventId)
        {
            using (var context = new Context())
            {
                var generalEventStudent = context.GeneralEventStudents
                    .Include(ges => ges.GeneralEvent)
                    .FirstOrDefault(ges => ges.StudentId == studentId && ges.GeneralEventId == generalEventId);

                if (generalEventStudent == null)
                {
                    return NotFound();
                }

                var generalEvent = context.GeneralEvents.Find(generalEventStudent.GeneralEventId);

                if (generalEvent == null)
                {
                    return NotFound();
                }

                var installments = new List<InstallmentDetailDto>();

                for (int i = 1; i <= generalEventStudent.GeneralEvent.Installments; i++)
                {
                    var installment = context.GeneralEventStudentsInstallments
                        .FirstOrDefault(gei => gei.EventId == generalEventId && gei.StudentId == studentId && gei.InstallmentNumber == i);

                    installments.Add(new InstallmentDetailDto
                    {
                        InstallmentNumber = i,
                        Paid = installment != null,
                        EventId = generalEventStudent.GeneralEventId,
                        StudentId = generalEventStudent.StudentId,
                        Installment = generalEventStudent.GeneralEvent.TotalPrice / generalEvent.Installments,
                        PayDate = installment?.PayDate
                    });
                }

                return Ok(installments);
            }
        }

        [HttpPost("AddStudent")]
        public IActionResult AddStudent([FromBody] StudentDto studentDto)
        {
            using (var context = new Context())
            {
                var group = context.Groups.Find(studentDto.GroupId);
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

                context.Students.Add(student);
                context.SaveChanges();
                return Ok();
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

                var existingEventStudent = context.EventStudents
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

                context.EventStudents.Add(eventStudent);
                context.SaveChanges();

                return Ok();
            }
        }

        [HttpPost("AddStudentToGeneralEvent")]
        public IActionResult AddStudentToGeneralEvent([FromBody] GeneralEventStudentDto dto)
        {
            if (dto == null)
            {
                return BadRequest(new { message = "Dados inválidos." });
            }

            using (var context = new Context())
            {
                var student = context.Students.Find(dto.StudentId);
                if (student == null)
                {
                    return NotFound(new { message = "Estudante não encontrado." });
                }

                var generalEvent = context.GeneralEvents.Find(dto.GeneralEventId);
                if (generalEvent == null)
                {
                    return NotFound(new { message = "Evento Geral não encontrado." });
                }

                var existingRecord = context.GeneralEventStudents
                    .FirstOrDefault(ges => ges.StudentId == dto.StudentId && ges.GeneralEventId == dto.GeneralEventId);

                if (existingRecord != null)
                {
                    return Conflict(new { message = "Estudante já registrado no Evento Geral." });
                }

                var generalEventStudent = new GeneralEventStudent
                {
                    GeneralEventId = dto.GeneralEventId,
                    StudentId = dto.StudentId,
                    PaidInstallments = dto.PaidInstallments
                };

                context.GeneralEventStudents.Add(generalEventStudent);
                context.SaveChanges();

                return Ok(new { message = "Estudante adicionado ao Evento Geral com sucesso." });
            }
        }


        [HttpGet("GetStudentParcelas/{studentId}")]
        public IActionResult GetStudentParcelas(int studentId)
        {
            using (var context = new Context())
            {
                var eventStudents = context.EventStudents
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
        }

        [HttpPost("PagarParcelas")]
        public IActionResult PagarParcelas([FromBody] List<InstallmentDetailDto> installmentDetails)
        {
            using (var context = new Context())
            {
                foreach (var installment in installmentDetails)
                {
                    var eventStudent = context.EventStudents
                        .FirstOrDefault(es => es.EventId == installment.EventId && es.StudentId == installment.StudentId);

                    if (eventStudent != null)
                    {
                        if (installment.InstallmentNumber > eventStudent.PaidInstallments)
                        {
                            eventStudent.PaidInstallments = installment.InstallmentNumber;
                        }
                    }
                }

                context.SaveChanges();
                return Ok(new { message = "Parcelas pagas com sucesso." });
            }
        }

        [HttpPost("PayGeneralEventInstallment")]
        public IActionResult PayGeneralEventInstallment([FromBody] InstallmentGeneralEventPaymentDto request)
        {
            using (var context = new Context())
            {
                var generalEventStudent = context.GeneralEventStudents
                    .FirstOrDefault(ges => ges.StudentId == request.StudentId && ges.GeneralEventId == request.GeneralEventId);
                if (generalEventStudent == null)
                {
                    return NotFound(new { message = "Registro de Estudante no Evento Geral não encontrado." });
                }

                for (int i = 0; i < request.InstallmentsToPay; i++)
                {
                    int installmentNumber = generalEventStudent.PaidInstallments + 1;

                    var installment = new GeneralEventStudentsInstallments
                    {
                        EventId = request.GeneralEventId,
                        StudentId = request.StudentId,
                        InstallmentNumber = installmentNumber,
                        PayDate = DateTime.UtcNow
                    };

                    context.GeneralEventStudentsInstallments.Add(installment);

                    generalEventStudent.PaidInstallments += 1;
                }

                context.GeneralEventStudents.Update(generalEventStudent);
                context.SaveChanges();

                return Ok(new { message = "Parcelas pagas com sucesso." });
            }
        }


        [HttpPost("GetStudentGroupNameByStudentId")]
        public IActionResult GetStudentGroupNameByStudentId(List<int> StudentsIds)
        {
            using (var context = new Context())
            {
                var studentGroup = new List<StudentGroupDto>();
                foreach (var studentId in StudentsIds)
                {
                    var studentDto = context.Students.Find(studentId);
                    if (studentDto != null)
                    {
                        var student = new StudentGroupDto(studentDto);
                        var group = context.Groups.Find(studentDto.GroupId);
                        if (group != null)
                        {
                            student.GroupName = group.Name;
                            studentGroup.Add(student);
                        }
                    }
                }
                return Ok(studentGroup);
            }
        }

        [HttpGet("GetStudentsByGroup/{groupId}")]
        public IActionResult GetStudentsByGroup(int groupId)
        {
            using (var context = new Context())
            {
                var students = context.Students
                    .Where(s => s.GroupId == groupId)
                    .ToList();

                if (students == null || students.Count == 0)
                {
                    return NotFound(new { message = "Nenhum aluno encontrado para o grupo especificado." });
                }
                return Ok(students);
            }
        }

        [HttpDelete("RemoveStudentFromGeneralEvent")]
        public IActionResult RemoveStudentFromGeneralEvent(int generalEventId, int studentId)
        {
            using (var context = new Context())
            {
                var generalEventStudent = context.GeneralEventStudents
                    .FirstOrDefault(ges => ges.GeneralEventId == generalEventId && ges.StudentId == studentId);

                if (generalEventStudent == null)
                {
                    return NotFound(new { message = "Registro não encontrado para o Estudante no Evento Geral." });
                }

                context.GeneralEventStudents.Remove(generalEventStudent);
                context.SaveChanges();

                return Ok(new { message = "Estudante removido do Evento Geral com sucesso." });
            }
        }
    }
}
