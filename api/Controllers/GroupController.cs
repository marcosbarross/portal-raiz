using System.Text.RegularExpressions;
using api_raiz.Data;
using api_raiz.Dtos.StudentsDto;
using Microsoft.AspNetCore.Mvc;
using Group = api_raiz.Models.GroupModels.Group;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        [HttpGet("GetGroups")]
        public IActionResult GetGroups()
        {
            using (var context = new Context())
            {
                return Ok(context.Groups.ToList());
            }
        }

        [HttpGet("GetGroupDetail/{id}")]
        public IActionResult GetGroupDetail(int id)
        {
            using (var context = new Context())
            {
                var group = context.Groups
                    .Where(g => g.Id == id)
                    .Select(g => new GroupDetailDto
                    {
                        Id = g.Id,
                        Name = g.Name,
                        Level = g.Level.Name,
                        Shift = g.Shift.Name,
                        Students = g.Students.Select(s => new StudentDto
                        {
                            Registration = s.Registration,
                            Name = s.Name,
                            Responsible = s.Responsible,
                            GroupId = s.GroupId
                        }).ToList()
                    })
                    .FirstOrDefault();

                if (group == null)
                {
                    return NotFound();
                }
                return Ok(group);
            }
        }

        [HttpPost("AddGroup")]
        public IActionResult AddGroup(Group group)
        {
            using (var context = new Context())
            {
                context.Groups.Add(group);
                context.SaveChanges();
                return Ok();
            }
        }

        [HttpDelete("RemoveGroup/{id}")]
        public IActionResult RemoveGroup(int id)
        {
            using (var context = new Context())
            {
                var group = context.Groups.Find(id);
                if (group == null)
                {
                    return NotFound();
                }

                context.Groups.Remove(group);
                context.SaveChanges();
                return Ok();
            }
        }

        [HttpDelete("RemoveStudentFromGroup/{studentId}")]
        public IActionResult RemoveStudentFromGroup(int studentId)
        {
            using (var context = new Context())
            {
                var student = context.Students.Find(studentId);
                if (student == null)
                {
                    return NotFound();
                }

                context.Students.Remove(student);
                context.SaveChanges();
                return Ok();
            }
        }
    }
}
