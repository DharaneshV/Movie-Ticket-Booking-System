using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace MovieTicketBooking.Application.Authorization;

public static class BookingOperations
{
    public static readonly OperationAuthorizationRequirement Create = new() { Name = nameof(Create) };
    public static readonly OperationAuthorizationRequirement Read = new() { Name = nameof(Read) };
    public static readonly OperationAuthorizationRequirement Cancel = new() { Name = nameof(Cancel) };
    public static readonly OperationAuthorizationRequirement Delete = new() { Name = nameof(Delete) };
}

