using api_raiz.Data;
using api_raiz.Models;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GroupController : ControllerBase
    {
        private readonly Context _context;

        public GroupController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetGroups")]
        public IActionResult GetGroups()
        {
            return Ok(_context.Groups.ToList());
        }

        [HttpGet("GetGroupDetail/{id}")]
        public IActionResult GetGroupDetail(int id)
        {
            var group = _context.Groups
                .Where(g => g.id == id)
                .Select(g => new GroupDetailDto
                {
                    Id = g.id,
                    Name = g.name,
                    Level = g.level,
                    Shift = g.shift,
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

        [HttpPost("AddGroup")]
        public IActionResult AddGroup([FromBody] Group group)
        {
            _context.Groups.Add(group);
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("RemoveGroup/{id}")]
        public IActionResult RemoveGroup(int id)
        {
            var group = _context.Groups.Find(id);
            if (group == null)
            {
                return NotFound();
            }
            _context.Groups.Remove(group);
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("RemoveStudentFromGroup/{studentId}")]
        public IActionResult RemoveStudentFromGroup(int studentId)
        {
            var student = _context.Students.Find((studentId));
            if (student == null)
            {
                return NotFound();
            }
            else
            {
                _context.Students.Remove(student);
                _context.SaveChanges();
            }
            return Ok();
        }
    }
}
