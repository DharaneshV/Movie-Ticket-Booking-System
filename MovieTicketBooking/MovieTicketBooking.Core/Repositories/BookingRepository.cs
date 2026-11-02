using Microsoft.EntityFrameworkCore;
using MovieTicketBooking.Core.Models;
using MovieTicketBooking.Core.Repositories.Interfaces;
using MovieTicketBooking.Infrastructure.Data;

namespace MovieTicketBooking.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly ApplicationDbContext _context;
    public BookingRepository(ApplicationDbContext context) => _context = context;

    public async Task<IEnumerable<Booking>> GetAllAsync() =>
        await _context.Bookings
            .Include(b => b.Show).ThenInclude(s => s.Movie)
            .Include(b => b.Show).ThenInclude(s => s.Screen).ThenInclude(sc => sc.Theatre)
            .Include(b => b.BookingSeats).ThenInclude(bs => bs.Seat)
            .ToListAsync();

    public async Task<Booking?> GetByIdAsync(int id) =>
        await _context.Bookings
            .Include(b => b.Show).ThenInclude(s => s.Movie)
            .Include(b => b.Show).ThenInclude(s => s.Screen).ThenInclude(sc => sc.Theatre)
            .Include(b => b.BookingSeats).ThenInclude(bs => bs.Seat)
            .FirstOrDefaultAsync(b => b.BookingId == id);

    public async Task<IEnumerable<Booking>> GetByShowIdAsync(int showId) =>
        await _context.Bookings
            .Include(b => b.BookingSeats).ThenInclude(bs => bs.Seat)
            .Where(b => b.ShowId == showId)
            .ToListAsync();

    public async Task<Booking> CreateBookingAsync(Booking booking, IEnumerable<BookingSeat> bookingSeats, IEnumerable<ShowSeat> showSeatsToUpdate)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            _context.Bookings.Add(booking);
            await _context.SaveChangesAsync();

            foreach (var bs in bookingSeats)
            {
                bs.BookingId = booking.BookingId;
            }
            _context.BookingSeats.AddRange(bookingSeats);

            foreach (var ss in showSeatsToUpdate)
            {
                ss.Status = "Booked";
                _context.ShowSeats.Update(ss);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
            return booking;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    public async Task CancelBookingAsync(Booking booking, IEnumerable<ShowSeat> showSeatsToRelease)
    {
        using var transaction = await _context.Database.BeginTransactionAsync();
        try
        {
            booking.Status = "Cancelled";
            _context.Bookings.Update(booking);

            foreach (var ss in showSeatsToRelease)
            {
                ss.Status = "Available";
                _context.ShowSeats.Update(ss);
            }

            await _context.SaveChangesAsync();
            await transaction.CommitAsync();
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}