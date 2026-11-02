using Microsoft.AspNetCore.Mvc;
using MovieTicketBooking.Core.DTOs.Theatres;
using MovieTicketBooking.Core.Services.Interfaces;

namespace MovieTicketBooking.Api.Controllers;

[Route("api/theatres")]
[ApiController]
public class TheatresController : ControllerBase
{
    private readonly ITheatreService _theatreService;
    public TheatresController(ITheatreService theatreService) => _theatreService = theatreService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TheatreResponse>>> GetAll() => Ok(await _theatreService.GetAllTheatresAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TheatreResponse>> GetById(int id)
    {
        var theatre = await _theatreService.GetTheatreByIdAsync(id);
        if (theatre == null) return NotFound();
        return Ok(theatre);
    }

    [HttpPost]
    public async Task<ActionResult<TheatreResponse>> Create([FromBody] CreateTheatreRequest request)
    {
        var created = await _theatreService.CreateTheatreAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.TheatreId }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateTheatreRequest request)
    {
        if (!await _theatreService.UpdateTheatreAsync(id, request)) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _theatreService.DeleteTheatreAsync(id)) return Conflict("Cannot delete theatre due to existing dependencies.");
        return NoContent();
    }
}