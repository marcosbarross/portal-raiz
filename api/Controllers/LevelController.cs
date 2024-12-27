using api_raiz.Data;
using api_raiz.Models.GroupModels;
using Microsoft.AspNetCore.Mvc;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LevelController : ControllerBase
    {
        private readonly Context _context;

        public LevelController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetLevels")]
        public IActionResult GetLevels()
        {
            return Ok(_context.Levels.ToList());
        }

        [HttpPost("AddLevel")]
        public IActionResult AddLevel(Level level)
        {
            _context.Levels.Add(level);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("UpdateLevel/{id}")]
        public IActionResult UpdateLevel(int id, Level level)
        {
            var existingLevel = _context.Levels.Find(id);
            if (existingLevel == null)
            {
                return NotFound();
            }

            existingLevel.Name = level.Name;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("DeleteLevel/{id}")]
        public IActionResult DeleteLevel(int id)
        {
            var level = _context.Levels.Find(id);
            if (level == null)
            {
                return NotFound();
            }

            _context.Levels.Remove(level);
            _context.SaveChanges();
            return Ok();
        }
    }
}
