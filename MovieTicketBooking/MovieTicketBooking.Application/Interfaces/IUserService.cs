using MovieTicketBooking.Application.DTOs.Auth;

namespace MovieTicketBooking.Application.Interfaces;

public interface IUserService
{
	Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto);
	Task<(bool Success, string Message, string? Token)> LoginAsync(LoginDto dto);
	Task CreateRoleUserAsync(string fullName, string email, string password, string role);
}
