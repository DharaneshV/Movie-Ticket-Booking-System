using MovieTicketBooking.Core.DTOs.Bookings;

namespace MovieTicketBooking.Core.Services.Interfaces;

public interface IBookingService
{
	Task<IEnumerable<BookingResponse>> GetAllBookingsAsync();
	Task<BookingResponse?> GetBookingByIdAsync(int id);
	Task<IEnumerable<BookingResponse>> GetBookingsByShowIdAsync(int showId);
	Task<BookingResponse> CreateBookingAsync(CreateBookingRequest request);
	Task<bool> CancelBookingAsync(int id);
}