using Microsoft.EntityFrameworkCore;
using MovieTicketBooking.Core.Models;
using MovieTicketBooking.Core.Repositories.Interfaces;
using MovieTicketBooking.Infrastructure.Data;

namespace MovieTicketBooking.Infrastructure.Repositories;

public class MovieRepository : IMovieRepository
{
    private readonly ApplicationDbContext _context;

    public MovieRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Movie>> GetAllAsync() => await _context.Movies.ToListAsync();

    public async Task<Movie?> GetByIdAsync(int id) => await _context.Movies.FindAsync(id);

    public async Task<IEnumerable<Movie>> SearchByTitleAsync(string title) =>
        await _context.Movies.Where(m => m.Title.Contains(title)).ToListAsync();

    public async Task<Movie> AddAsync(Movie movie)
    {
        _context.Movies.Add(movie);
        await _context.SaveChangesAsync();
        return movie;
    }

    public async Task UpdateAsync(Movie movie)
    {
        _context.Movies.Update(movie);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteAsync(Movie movie)
    {
        _context.Movies.Remove(movie);
        await _context.SaveChangesAsync();
    }
}