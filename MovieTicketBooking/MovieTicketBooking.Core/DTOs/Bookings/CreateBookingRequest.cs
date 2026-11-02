using System.ComponentModel.DataAnnotations;

namespace MovieTicketBooking.Core.DTOs.Bookings;

public class CreateBookingRequest
{
    [Required]
    [MaxLength(15)]
    public string CustomerPhone { get; set; } = string.Empty;

    [Required]
    public int ShowId { get; set; }

    [Required]
    public List<int> SeatIds { get; set; } = new();
}
