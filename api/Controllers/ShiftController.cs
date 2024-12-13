using api_raiz.Data;
using api_raiz.Models.GroupModels;
using Microsoft.AspNetCore.Mvc;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ShiftController : ControllerBase
    {
        private readonly Context _context;

        public ShiftController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetShifts")]
        public IActionResult GetShifts()
        {
            return Ok(_context.Shifts.ToList());
        }

        [HttpPost("AddShift")]
        public IActionResult AddShift(Shift shift)
        {
            _context.Shifts.Add(shift);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("UpdateShift/{id}")]
        public IActionResult UpdateShift(int id, Shift shift)
        {
            var existingShift = _context.Shifts.Find(id);
            if (existingShift == null)
            {
                return NotFound();
            }

            existingShift.Name = shift.Name;
            _context.SaveChanges();
            return Ok();
        }

        [HttpDelete("DeleteShift/{id}")]
        public IActionResult DeleteShift(int id)
        {
            var shift = _context.Shifts.Find(id);
            if (shift == null)
            {
                return NotFound();
            }

            _context.Shifts.Remove(shift);
            _context.SaveChanges();
            return Ok();
        }
    }
}
