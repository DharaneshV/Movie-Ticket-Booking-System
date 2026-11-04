import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginDto } from '../../models/auth/login-dto';
import { RegisterDto } from '../../models/auth/register-dto';
import { UserInfo } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:5000/api/auth';

  // Reactive user signal for modern zoneless Angular
  currentUser = signal<UserInfo | null>(this.getUserFromToken());

  constructor(private http: HttpClient) { }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, dto).pipe(
      tap((res) => {
        if (res && res.token) {
          this.saveToken(res.token);
        }
      })
    );
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
    this.currentUser.set(this.getUserFromToken());
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    this.currentUser.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.getToken() && !!this.currentUser();
  }

  isAdmin(): boolean {
    const user = this.currentUser();
    return user?.role === 'Admin';
  }

  private getUserFromToken(): UserInfo | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      const base64Url = parts[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      const decoded = JSON.parse(jsonPayload);

      // Check expiry
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('jwt_token');
        return null;
      }

      const userId =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ||
        decoded['nameid'] ||
        decoded['sub'] ||
        0;

      const fullName =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
        decoded['name'] ||
        decoded['unique_name'] ||
        'User';

      const email =
        decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
        decoded['email'] ||
        '';

      const role =
        decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
        decoded['role'] ||
        'Customer';

      return {
        userId: Number(userId),
        fullName,
        email,
        role
      };
    } catch {
      return null;
    }
  }
}
