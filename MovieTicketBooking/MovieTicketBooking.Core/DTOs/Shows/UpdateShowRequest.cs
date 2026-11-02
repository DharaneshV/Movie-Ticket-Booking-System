namespace MovieTicketBooking.Core.DTOs.Shows;

public class UpdateShowRequest
{
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public decimal TicketPrice { get; set; }
}