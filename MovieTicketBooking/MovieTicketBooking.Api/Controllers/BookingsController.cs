using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MovieTicketBooking.Application.Authorization;
using MovieTicketBooking.Core.DTOs.Bookings;
using MovieTicketBooking.Core.Services.Interfaces;

namespace MovieTicketBooking.Api.Controllers;

[Authorize]
[Route("api/bookings")]
[ApiController]
public class BookingsController(IBookingService service, IAuthorizationService authorizationService) : ControllerBase
{
    private int? GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(value, out var userId) ? userId : null;
    }

    // Admin can view all bookings
    [Authorize(Policy = "AdminOnly")]
    [HttpGet]
    public async Task<ActionResult<IEnumerable<BookingResponse>>> GetAll() => Ok(await service.GetAllBookingsAsync());

    // Customer can view own bookings list. Admin can view all.
    [Authorize(Policy = "CustomerOrAdmin")]
    [HttpGet("my")]
    public async Task<ActionResult<IEnumerable<BookingResponse>>> GetMyBookings()
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var bookings = await service.GetBookingsByUserIdAsync(userId.Value);
        return Ok(bookings);
    }

    // Customer can view own booking. Admin can view any booking.
    // Protected by Resource-Based Authorization (BookingAuthorizationHandler)
    [Authorize(Policy = "CustomerOrAdmin")]
    [HttpGet("{id:int}")]
    public async Task<ActionResult<BookingResponse>> GetById(int id)
    {
        var booking = await service.GetBookingByIdAsync(id);
        if (booking == null) return NotFound();

        var authResult = await authorizationService.AuthorizeAsync(User, booking, BookingOperations.Read);
        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        return Ok(booking);
    }

    // Admin can view bookings for a particular show
    [Authorize(Policy = "AdminOnly")]
    [HttpGet("show/{showId:int}")]
    public async Task<ActionResult<IEnumerable<BookingResponse>>> ByShow(int showId) => Ok(await service.GetBookingsByShowIdAsync(showId));

    // Customer/Admin can create bookings
    [Authorize(Policy = "CustomerOrAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest request)
    {
        var userId = GetCurrentUserId();
        if (userId is null) return Unauthorized();

        var name = User.FindFirstValue(ClaimTypes.Name);
        var email = User.FindFirstValue(ClaimTypes.Email);
        if (name is null || email is null) return Unauthorized();

        try
        {
            var created = await service.CreateBookingAsync(request, userId.Value, name, email);
            return CreatedAtAction(nameof(GetById), new { id = created.BookingId }, created);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    // Customer can cancel own booking. Admin can cancel any booking.
    // Protected by Resource-Based Authorization (BookingAuthorizationHandler)
    [Authorize(Policy = "CustomerOrAdmin")]
    [HttpPut("{id:int}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var booking = await service.GetBookingByIdAsync(id);
        if (booking == null) return NotFound();

        var authResult = await authorizationService.AuthorizeAsync(User, booking, BookingOperations.Cancel);
        if (!authResult.Succeeded)
        {
            return Forbid();
        }

        var result = await service.CancelBookingAsync(id);
        return result.Success
            ? Ok(new { message = "Booking successfully cancelled and seats released." })
            : BadRequest(new { message = result.Error });
    }
}
