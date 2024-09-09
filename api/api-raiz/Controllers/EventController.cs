using api_raiz.Data;
using api_raiz.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        private readonly Context _context;

        public EventController(Context context)
        {
            _context = context;
        }

        [HttpPost("AddEvent")]
        public IActionResult AddEvent([FromBody] Event @event)
        {
            _context.Events.Add(@event);
            _context.SaveChanges();
            return Ok();
        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents()
        {
            var events = _context.Events.ToList();
            return Ok(events);
        }

        [HttpGet("GetEventDetails/{id}")]
        public IActionResult GetEventDetails(int id)
        {
            var evento = _context.Events
                .Include(e => e.EventStudents)
                .ThenInclude(es => es.Student)
                .FirstOrDefault(e => e.Id == id);

            if (evento == null)
            {
                return NotFound();
            }

            var eventDetails = new EventDetailsDto
            {
                Id = evento.Id,
                Name = evento.Name,
                Installments = evento.Installments,
                Date = evento.Date,
                TotalPrice = evento.TotalPrice,
                Students = evento.EventStudents.Select(es => new StudentDto
                {
                    Registration = es.Student.Registration,
                    Name = es.Student.Name,
                    Responsible = es.Student.Responsible
                }).ToList()
            };

            return Ok(eventDetails);
        }

        [HttpGet("GetEventById/{id}")]
        public IActionResult GetEventById(int id)
        {
            var evento = _context.Events.Find(id);
            if (evento == null)
            {
                return NotFound();
            }
            return Ok(evento);
        }
    }
}
