using Microsoft.AspNetCore.Mvc;
using MovieTicketBooking.Core.DTOs.Screens;
using MovieTicketBooking.Core.Services.Interfaces;

namespace MovieTicketBooking.Api.Controllers;

[Route("api/screens")]
[ApiController]
public class ScreensController : ControllerBase
{
    private readonly IScreenService _screenService;
    public ScreensController(IScreenService screenService) => _screenService = screenService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ScreenResponse>>> GetAll() => Ok(await _screenService.GetAllScreensAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ScreenResponse>> GetById(int id)
    {
        var screen = await _screenService.GetScreenByIdAsync(id);
        if (screen == null) return NotFound();
        return Ok(screen);
    }

    [HttpGet("theatre/{theatreId:int}")]
    public async Task<ActionResult<IEnumerable<ScreenResponse>>> GetByTheatre(int theatreId) => Ok(await _screenService.GetScreensByTheatreIdAsync(theatreId));

    [HttpPost]
    public async Task<ActionResult<ScreenResponse>> Create([FromBody] CreateScreenRequest request)
    {
        var created = await _screenService.CreateScreenAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.ScreenId }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateScreenRequest request)
    {
        if (!await _screenService.UpdateScreenAsync(id, request)) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _screenService.DeleteScreenAsync(id)) return Conflict("Cannot delete screen due to existing shows or seats.");
        return NoContent();
    }
}