import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { RegisterDto } from '../../../models/auth/register-dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  registerData: RegisterDto = {
    fullName: '',
    email: '',
    password: ''
  };
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.registerData.fullName || !this.registerData.email || !this.registerData.password) {
      this.errorMessage = 'Please fill in all fields.';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = res.message || 'Registration successful! Redirecting to login...';
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.title || 'Registration failed. Please check your details and try again.';
        this.cdr.markForCheck();
      }
    });
  }
}
