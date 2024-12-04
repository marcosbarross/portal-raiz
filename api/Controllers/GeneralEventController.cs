using Microsoft.AspNetCore.Mvc;
using api_raiz.Data;
using api_raiz.Models;
using Microsoft.EntityFrameworkCore;

namespace api_raiz.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeneralEventController : ControllerBase
    {
        private readonly Context _context;

        public GeneralEventController(Context context)
        {
            _context = context;
        }

        [HttpGet("GetGeneralEvents")]
        public IActionResult GetGeneralEvents()
        {
            var generalEvents = _context.GeneralEvents.ToList();
            return Ok(generalEvents);
        }

        [HttpGet("GetGeneralEventDetails/{id}")]
        public IActionResult GetGeneralEventDetails(int id)
        {
            var generalEvent = _context.GeneralEvents
                .Include(e => e.GeneralEventStudents)
                .ThenInclude(ges => ges.Student)
                .FirstOrDefault(e => e.Id == id);

            if (generalEvent == null)
            {
                return NotFound();
            }

            return Ok(generalEvent);
        }

        [HttpPost("AddGeneralEvent")]
        public IActionResult AddGeneralEvent([FromBody] GeneralEvent generalEvent)
        {
            generalEvent.Date = DateTime.SpecifyKind(generalEvent.Date, DateTimeKind.Utc);
            _context.GeneralEvents.Add(generalEvent);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPut("UpdateGeneralEvent/{id}")]
        public IActionResult UpdateGeneralEvent(int id, [FromBody] GeneralEvent updatedEvent)
        {
            var generalEvent = _context.GeneralEvents.Find(id);
            if (generalEvent == null)
            {
                return NotFound();
            }

            generalEvent.Name = updatedEvent.Name;
            generalEvent.Installments = updatedEvent.Installments;
            generalEvent.Date = DateTime.SpecifyKind(updatedEvent.Date, DateTimeKind.Utc);
            generalEvent.TotalPrice = updatedEvent.TotalPrice;
            _context.SaveChanges();

            return Ok();
        }

        [HttpDelete("DeleteGeneralEvent/{id}")]
        public IActionResult DeleteGeneralEvent(int id)
        {
            var generalEvent = _context.GeneralEvents.Find(id);
            if (generalEvent == null)
            {
                return NotFound();
            }
            _context.GeneralEvents.Remove(generalEvent);
            _context.SaveChanges();
            return Ok();
        }
    }
}
