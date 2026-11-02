using MovieTicketBooking.Core.DTOs.Theatres;
using MovieTicketBooking.Core.Models;
using MovieTicketBooking.Core.Repositories.Interfaces;
using MovieTicketBooking.Core.Services.Interfaces;

namespace MovieTicketBooking.Application.Services;

public class TheatreService : ITheatreService
{
    private readonly ITheatreRepository _theatreRepository;
    public TheatreService(ITheatreRepository theatreRepository) => _theatreRepository = theatreRepository;

    public async Task<IEnumerable<TheatreResponse>> GetAllTheatresAsync()
    {
        var theatres = await _theatreRepository.GetAllAsync();
        return theatres.Select(t => new TheatreResponse { TheatreId = t.TheatreId, Name = t.Name, Location = t.Location });
    }

    public async Task<TheatreResponse?> GetTheatreByIdAsync(int id)
    {
        var t = await _theatreRepository.GetByIdAsync(id);
        if (t == null) return null;
        return new TheatreResponse { TheatreId = t.TheatreId, Name = t.Name, Location = t.Location };
    }

    public async Task<TheatreResponse> CreateTheatreAsync(CreateTheatreRequest request)
    {
        var theatre = new Theatre { Name = request.Name, Location = request.Location };
        var created = await _theatreRepository.AddAsync(theatre);
        return new TheatreResponse { TheatreId = created.TheatreId, Name = created.Name, Location = created.Location };
    }

    public async Task<bool> UpdateTheatreAsync(int id, UpdateTheatreRequest request)
    {
        var theatre = await _theatreRepository.GetByIdAsync(id);
        if (theatre == null) return false;
        theatre.Name = request.Name;
        theatre.Location = request.Location;
        await _theatreRepository.UpdateAsync(theatre);
        return true;
    }

    public async Task<bool> DeleteTheatreAsync(int id)
    {
        var theatre = await _theatreRepository.GetByIdAsync(id);
        if (theatre == null) return false;
        try
        {
            await _theatreRepository.DeleteAsync(theatre);
            return true;
        }
        catch { return false; }
    }
}