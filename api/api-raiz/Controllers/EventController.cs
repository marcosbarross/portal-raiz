using api_raiz.Models;
using api_raiz.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Collections.Generic;


namespace api_raiz.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EventController : ControllerBase
    {
        [HttpPost("AddEvent")]
        public IActionResult AddEvent([FromBody] Event @event)
        {
            using (var contexto = new Context())
            {
                contexto.Events.Add(@event);
                contexto.SaveChanges();
                return Ok();
            }
        }

        [HttpGet("GetEvents")]
        public IActionResult GetEvents()
        {
            using (var context = new Context())
            {
                var events = context.Events.ToList();
                return Ok(events);
            }
        }
        
        [HttpGet("GetEventDetails/{id}")]
        public IActionResult GetEventDetails(int id)
        {
            using (var context = new Context())
            {
                var evento = context.Events
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
                    Students = evento.EventStudents.Select(es => new StudentDto
                    {
                        Registration = es.Student.Registration,
                        Name = es.Student.Name,
                        Responsible = es.Student.Responsible
                    }).ToList()
                };

                return Ok(eventDetails);
            }
        }

        
        [HttpGet("GetEventById/{id}")]
        public IActionResult GetEventById(int id)
        {
            using (var context = new Context())
            {
                var evento = context.Events.Find(id);
                if (evento == null)
                {
                    return NotFound();
                }
                return Ok(evento);
            }
        }
    }
}