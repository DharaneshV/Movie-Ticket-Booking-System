using MovieTicketBooking.Core.Models;

namespace MovieTicketBooking.Application.Interfaces;

public interface IJwtService
{
    (string Token, DateTime ExpiresAt) GenerateToken(User user);
}
