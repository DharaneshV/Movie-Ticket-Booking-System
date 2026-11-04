import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginDto } from '../../models/auth/login-dto';
import { RegisterDto } from '../../models/auth/register-dto';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Ensure this port matches your backend API launchSettings.json port
  private baseUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) { }

  register(dto: RegisterDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, dto);
  }

  login(dto: LoginDto): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, dto);
  }

  saveToken(token: string): void {
    localStorage.setItem('jwt_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
  }
}
