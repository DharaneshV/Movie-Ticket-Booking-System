using MovieTicketBooking.Core.DTOs.Theatres;

namespace MovieTicketBooking.Core.Services.Interfaces;

public interface ITheatreService
{
	Task<IEnumerable<TheatreResponse>> GetAllTheatresAsync();
	Task<TheatreResponse?> GetTheatreByIdAsync(int id);
	Task<TheatreResponse> CreateTheatreAsync(CreateTheatreRequest request);
	Task<bool> UpdateTheatreAsync(int id, UpdateTheatreRequest request);
	Task<bool> DeleteTheatreAsync(int id);
}