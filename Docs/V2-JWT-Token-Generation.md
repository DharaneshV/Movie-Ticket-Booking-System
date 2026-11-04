# V2 – User Login & JWT Token Generation
## Objective
V2 adds login functionality. After validating a user's credentials, the API generates a JSON Web Token (JWT). Token validation on incoming API requests is covered in V3.
## Authentication and password hashing
Authentication establishes who the user is. The user supplies an email and password; the backend verifies them against the registered account.
The database stores `PasswordHash`, not the original password. The password hasher verifies the supplied password against the stored hash.
The application registers the hasher:
```csharp
builder.Services.AddScoped<IPasswordHasher<User>, PasswordHasher<User>>();
```
## Login flow
```text
Client sends email + password
|
v
Login API
|
v
UserService
|
| Find user by email
| Verify password hash
v
Credentials valid?
/ \
No Yes
| |
Authentication JwtService
failure response |
v
Generate JWT
|
v
Return token
```
## JWT structure
A JWT consists of three Base64URL-encoded sections:
```text
Header.Payload.Signature
```
- Header identifies the token type and signing algorithm.
- Payload contains claims about the authenticated user.
- Signature allows the API to verify that the token has not been modified and was signed using the expected key.
A signed JWT is not automatically encrypted. Do not place passwords or secrets in its payload.
## Claims used by this project
| Claim | Value |
|---|---|
| NameIdentifier | UserId |
| Name | FullName |
| Email | Email |
| Role | User role |
```csharp
var claims = new[]
{
new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
new Claim(ClaimTypes.Name, user.FullName),
new Claim(ClaimTypes.Email, user.Email),
new Claim(ClaimTypes.Role, user.Role)
};
```
## Token signing and configuration
The project uses a symmetric signing key and HMAC-SHA256. The token includes issuer, audience, expiration and signing credentials.
JWT settings are read from the `Jwt` configuration section, including Key, Issuer, Audience and ExpiryMinutes. Signing keys must be kept secret and must not be committed to source control. Use User Secrets in development or a secure configuration provider in production.
## Testing
Use Postman to call the login endpoint with a registered user's credentials. Verify that valid credentials return a token, invalid credentials are rejected, and the response does not expose the stored password hash.
## V2 outcome
V2 adds credential verification and JWT generation. V3 configures the API to validate bearer tokens on incoming requests and protects selected endpoints.

