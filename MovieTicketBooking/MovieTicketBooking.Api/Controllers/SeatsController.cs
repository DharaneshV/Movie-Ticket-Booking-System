using Microsoft.AspNetCore.Mvc;
using MovieTicketBooking.Core.DTOs.Seats;
using MovieTicketBooking.Core.Services.Interfaces;

namespace MovieTicketBooking.Api.Controllers;

[Route("api/seats")]
[ApiController]
public class SeatsController : ControllerBase
{
    private readonly ISeatService _seatService;
    public SeatsController(ISeatService seatService) => _seatService = seatService;

    [HttpGet("screen/{screenId:int}")]
    public async Task<ActionResult<IEnumerable<SeatResponse>>> GetByScreen(int screenId) => Ok(await _seatService.GetSeatsByScreenIdAsync(screenId));

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SeatResponse>> GetById(int id)
    {
        var seat = await _seatService.GetSeatByIdAsync(id);
        if (seat == null) return NotFound();
        return Ok(seat);
    }

    [HttpPost]
    public async Task<ActionResult<SeatResponse>> Create([FromBody] CreateSeatRequest request)
    {
        var created = await _seatService.CreateSeatAsync(request);
        return CreatedAtAction(nameof(GetById), new { id = created.SeatId }, created);
    }

    [HttpPost("bulk")]
    public async Task<ActionResult<IEnumerable<SeatResponse>>> BulkCreate([FromBody] BulkCreateSeatsRequest request)
    {
        var createdSeats = await _seatService.BulkCreateSeatsAsync(request);
        return Ok(createdSeats);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSeatRequest request)
    {
        if (!await _seatService.UpdateSeatAsync(id, request)) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (!await _seatService.DeleteSeatAsync(id)) return Conflict("Cannot delete seat due to existing bookings.");
        return NoContent();
    }
}