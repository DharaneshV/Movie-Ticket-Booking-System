using MovieTicketBooking.Core.Models; // Adjust namespace to where your User model is located

namespace MovieTicketBooking.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
}