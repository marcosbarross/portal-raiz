using api_raiz.Models;
using api_raiz.Data;
using Microsoft.AspNetCore.Mvc;

namespace api_raiz.Controllers;

[Route("api/[controller]")]
[ApiController]
public class EventController : ControllerBase
{
    [HttpPost("AddEvent")]
    public IActionResult AddEvent ([FromBody] Event @event)
    {
        using (var contexto = new Context())
        {
            contexto.Events.Add(@event);
            contexto.SaveChanges();
            return Ok();
        }
    }

    [HttpGet]
    public IActionResult GetEvents()
    {
        using (var context = new Context())
        {
            var events = context.Events.ToList();
            return Ok(events);
        }
    }
}