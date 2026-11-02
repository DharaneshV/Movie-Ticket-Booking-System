using Microsoft.EntityFrameworkCore;
using MovieTicketBooking.Core.Entities;
using MovieTicketBooking.Core.Repositories.Interfaces;
using MovieTicketBooking.Infrastructure.Data;

namespace MovieTicketBooking.Infrastructure.Repositories;

public class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public async Task<User?> GetByEmailAsync(string email)
    {
        return await context.Set<User>().FirstOrDefaultAsync(u => u.Email == email);
    }

    public async Task AddAsync(User user)
    {
        await context.Set<User>().AddAsync(user);
        await context.SaveChangesAsync();
    }
}