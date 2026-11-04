# V1 – Movie Ticket Booking Backend & User Registration
## Objective
V1 establishes the initial backend using .NET 10, ASP.NET Core Web API, EF Core and SQL Server Express. It includes the core movie, theatre, screen, seat, show and booking workflows, plus customer registration.
## Technology
- .NET 10 and ASP.NET Core Web API Controllers
- Entity Framework Core 10
- SQL Server Express
- Scalar / OpenAPI
- Postman and Visual Studio
## Application architecture
```text
HTTP Request
|
Controller
|
Service
|
Repository
|
ApplicationDbContext
|
SQL Server
```
- **Controller:** receives HTTP requests and returns HTTP responses.
- **Service:** contains application business rules.
- **Repository:** encapsulates database queries and persistence.
- **ApplicationDbContext:** EF Core database session and entity sets.
## Main entities
Movie, Theatre, Screen, Seat, Show, ShowSeat, Booking, BookingSeat and User.
Important relationships:
- One Theatre has many Screens.
- One Screen has many Seats.
- One Movie can have many Shows.
- One Screen can host many Shows.
- One Show has many ShowSeat records.
- One Booking belongs to one Show and has many BookingSeat records.
`Seat` represents a physical seat. `ShowSeat` represents that seat's availability for a particular show. `BookingSeat` records the seats included in a booking.
## Booking workflow
1. Customer selects a show and seats.
2. Service rejects an empty or duplicate seat selection.
3. Service verifies that every selected seat belongs to the show.
4. Service checks that all selected seats are available.
5. Total amount is calculated from ticket price and selected seat count.
6. Booking and BookingSeat records are created.
7. Selected ShowSeat records are marked as booked.
8. Changes are saved in a database transaction.
A transaction makes the writes all-or-nothing. It does not, by itself, fully prevent simultaneous requests from attempting to book the same seat; concurrency protection is a separate concern.
## Cancellation workflow
The service retrieves the booking, checks its status, marks it as Cancelled, changes associated ShowSeat records to Available and saves the changes.
## User registration
The User entity stores FullName, Email, PasswordHash, Role and CreatedAt. Passwords must be hashed, not stored as plain text. A unique email index prevents duplicate registered email addresses.
## API exploration and testing
Scalar/OpenAPI is used to explore endpoints. Postman is used to send requests and inspect responses. GET retrieves resources, POST creates, PUT updates or performs an action, and DELETE removes resources.
## V1 outcome
V1 establishes the core backend, database relationships, booking and cancellation workflows, and user registration. V2 adds login and JWT generation.

