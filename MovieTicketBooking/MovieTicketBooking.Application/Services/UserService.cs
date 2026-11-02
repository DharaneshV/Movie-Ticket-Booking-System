using Microsoft.AspNetCore.Identity;
using MovieTicketBooking.Application.DTOs.Auth;
using MovieTicketBooking.Application.Interfaces;
using MovieTicketBooking.Core.Models;
using MovieTicketBooking.Core.Repositories.Interfaces;

namespace MovieTicketBooking.Application.Services;

public class UserService(
	IUserRepository repo,
	IPasswordHasher<User> passwordHasher,
	IJwtService jwtService) : IUserService
{
	public async Task<(bool Success, string Message)> RegisterAsync(RegisterDto dto)
	{
		var email = dto.Email.Trim().ToLower();
		var existingUser = await repo.GetByEmailAsync(email);
		if (existingUser != null)
		{
			return (false, "Email is already registered.");
		}

		var user = new User
		{
			FullName = dto.FullName,
			Email = email,
			Role = "Customer"
		};

		user.PasswordHash = passwordHasher.HashPassword(user, dto.Password);
		await repo.AddAsync(user);

		return (true, "Registration successful.");
	}

	public async Task<(bool Success, string Message, string? Token)> LoginAsync(LoginDto dto)
	{
		var email = dto.Email.Trim().ToLower();
		var user = await repo.GetByEmailAsync(email);

		if (user is null)
		{
			return (false, "Invalid email or password.", null);
		}

		var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, dto.Password);
		if (result == PasswordVerificationResult.Failed)
		{
			return (false, "Invalid email or password.", null);
		}

		var token = jwtService.GenerateToken(user);
		return (true, "Login successful.", token);
	}
}
