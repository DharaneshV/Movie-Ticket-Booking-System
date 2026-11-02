using Microsoft.AspNetCore.Mvc;
using MovieTicketBooking.Core.DTOs.Bookings;
using MovieTicketBooking.Core.Services.Interfaces;

namespace MovieTicketBooking.Api.Controllers;

[Route("api/bookings")]
[ApiController]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;
    public BookingsController(IBookingService bookingService) => _bookingService = bookingService;

    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingResponse>>> GetAll() => Ok(await _bookingService.GetAllBookingsAsync());

    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookingResponse>> GetById(int id)
    {
        var booking = await _bookingService.GetBookingByIdAsync(id);
        if (booking == null) return NotFound();
        return Ok(booking);
    }

    [HttpGet("show/{showId:int}")]
    public async Task<ActionResult<IEnumerable<BookingResponse>>> GetByShow(int showId) => Ok(await _bookingService.GetBookingsByShowIdAsync(showId));

    [HttpPost]
    public async Task<ActionResult<BookingResponse>> Create([FromBody] CreateBookingRequest request)
    {
        try
        {
            var created = await _bookingService.CreateBookingAsync(request);
            return CreatedAtAction(nameof(GetById), new { id = created.BookingId }, created);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message); // 409 Conflict if seat is already taken[cite: 10]
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var success = await _bookingService.CancelBookingAsync(id);
        if (!success) return Conflict("Booking not found or already cancelled.");
        return Ok(new { message = "Booking successfully cancelled and seats released." });
    }
}