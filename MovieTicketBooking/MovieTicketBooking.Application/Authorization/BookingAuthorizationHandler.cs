using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authorization.Infrastructure;
using MovieTicketBooking.Core.Constants;
using MovieTicketBooking.Core.DTOs.Bookings;

namespace MovieTicketBooking.Application.Authorization;

public class BookingAuthorizationHandler : AuthorizationHandler<OperationAuthorizationRequirement, BookingResponse>
{
    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context,
        OperationAuthorizationRequirement requirement,
        BookingResponse resource)
    {
        if (context.User.Identity?.IsAuthenticated != true)
        {
            return Task.CompletedTask;
        }

        // Administrators can perform any operation on any booking
        if (context.User.IsInRole(UserRoles.Admin))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        // For read or cancel operations, customers can only access their own bookings
        if (requirement == BookingOperations.Read || requirement == BookingOperations.Cancel)
        {
            var userIdClaim = context.User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (int.TryParse(userIdClaim, out var userId) && resource.UserId == userId)
            {
                context.Succeed(requirement);
            }
        }

        return Task.CompletedTask;
    }
}

