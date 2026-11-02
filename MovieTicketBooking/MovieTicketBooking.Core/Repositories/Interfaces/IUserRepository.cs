using MovieTicketBooking.Core.Models;

namespace MovieTicketBooking.Core.Repositories.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email);
    Task AddAsync(User user);
}