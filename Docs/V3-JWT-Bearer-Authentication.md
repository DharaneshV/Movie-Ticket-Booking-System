# V3 – JWT Bearer Authentication & Protected Booking APIs
## Objective
V2 generated JWTs. V3 configures the API to validate those tokens on incoming requests and protects selected booking endpoints.
## JWT Bearer package
The project uses the ASP.NET Core JWT Bearer authentication package. The package version should be checked in the project's `.csproj` file.
Example installation command used during development:
```powershell
Install-Package Microsoft.AspNetCore.Authentication.JwtBearer -Version 10.0.2
```
## Authentication configuration
```csharp
builder.Services
.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
.AddJwtBearer(options =>
{
var jwt = builder.Configuration.GetSection("Jwt");
options.TokenValidationParameters = new TokenValidationParameters
{
ValidateIssuer = true,
ValidateAudience = true,
ValidateLifetime = true,
ValidateIssuerSigningKey = true,
ValidIssuer = jwt["Issuer"],
ValidAudience = jwt["Audience"],
IssuerSigningKey = new SymmetricSecurityKey(
Encoding.UTF8.GetBytes(jwt["Key"]!)
),
ClockSkew = TimeSpan.Zero
};
});
builder.Services.AddAuthorization();
```
| Setting | Purpose |
|---|---|
| ValidateIssuer | Checks the token issuer |
| ValidateAudience | Checks the intended audience |
| ValidateLifetime | Checks token expiration |
| ValidateIssuerSigningKey | Checks the signature |
| ValidIssuer / ValidAudience | Expected issuer and audience |
| IssuerSigningKey | Key used to validate the signature |
| ClockSkew | Allowed time tolerance for expiration |
The validation settings must match the token-generation settings.
## Middleware order
```csharp
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
```
1. `UseAuthentication()` validates the bearer token and establishes the user identity.
2. `UseAuthorization()` checks whether the identity is allowed to access the endpoint.
3. `MapControllers()` maps the request to controller actions.
Authentication must run before authorization.
## Protecting an endpoint
```csharp
[Authorize]
[HttpGet]
public async Task<IActionResult> GetBookings()
{
// ...
}
```
An endpoint with `[Authorize]` requires an authenticated user.
## Postman testing
1. Call the login endpoint.
2. Copy the returned JWT.
3. Open a protected endpoint in Postman.
4. Select Authorization.
5. Choose Bearer Token and paste the token.
6. Send the request.
The HTTP header is:
```http
Authorization: Bearer <JWT>
```
Do not put tokens in URLs or commit them to Git.
## Expected results
| Scenario | Expected result |
|---|---|
| No token on protected endpoint | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Expired token | 401 Unauthorized |
| Valid token | Request proceeds to authorization/action |
Role-specific access rules are introduced in V4.
## V3 outcome
V3 adds JWT bearer validation, authentication and authorization middleware, and protection for selected booking endpoints.

