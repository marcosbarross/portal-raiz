using api_raiz.Data;
using api_raiz.Dtos.StudentsDto;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using Group = api_raiz.Models.GroupModels.Group;

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

        [HttpGet("GetGroupsDetails")]
        public IActionResult GetGroupsDetails()
        {
            var groups = _context.Groups
                .Select(g => new
                {
                    g.Id,
                    g.Name,
                    LevelName = g.Level.Name,
                    ShiftName = g.Shift.Name
                })
                .ToList();

            var response = groups.Select(group => new GroupDetailDto(
                group.Id,
                group.Name,
                group.LevelName,
                group.ShiftName
            )).ToList();

            return Ok(response);
        }


        [HttpGet("GetGroupDetail/{id}")]
        public IActionResult GetGroupDetail(int id)
        {
            var group = _context.Groups
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

        [HttpPost("AddGroup")]
        public IActionResult AddGroup(GroupDto groupDto)
        {
            var group = new Group(groupDto);
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
            var student = _context.Students.Find(studentId);
            if (student == null)
            {
                return NotFound();
            }

            _context.Students.Remove(student);
            _context.SaveChanges();
            return Ok();
        }
    }
}
