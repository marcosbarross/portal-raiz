using api_raiz.Data;
using api_raiz.Models.GroupModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GradeController : ControllerBase
    {
        private readonly Context _context;

        public GradeController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetGrades")]
        public async Task<IActionResult> GetGrades()
        {
            var grades = await _context.Grades.Include(g => g.Level).ToListAsync();
            return Ok(grades);
        }

        [HttpPost("AddGrade")]
        public async Task<IActionResult> AddGrade(Grade grade)
        {
            var level = await _context.Levels.FindAsync(grade.LevelId);
            if (level == null)
            {
                return BadRequest("Invalid LevelId");
            }

            grade.Level = level;
            _context.Grades.Add(grade);
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpPut("UpdateGrade/{id}")]
        public async Task<IActionResult> UpdateGrade(int id, Grade grade)
        {
            var existingGrade = await _context.Grades.FindAsync(id);
            if (existingGrade == null)
            {
                return NotFound();
            }

            var level = await _context.Levels.FindAsync(grade.LevelId);
            if (level == null)
            {
                return BadRequest("Invalid LevelId");
            }

            existingGrade.Name = grade.Name;
            existingGrade.LevelId = grade.LevelId;
            existingGrade.Level = level;
            await _context.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("DeleteGrade/{id}")]
        public async Task<IActionResult> DeleteGrade(int id)
        {
            var grade = await _context.Grades.FindAsync(id);
            if (grade == null)
            {
                return NotFound();
            }

            _context.Grades.Remove(grade);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}
