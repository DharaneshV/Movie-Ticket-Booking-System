import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { LoginDto } from '../../../models/auth/login-dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credentials: LoginDto = { email: '', password: '' };
  errorMessage: string = '';
  isLoading: boolean = false;
  returnUrl: string = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLogin(): void {
    this.errorMessage = '';
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Please enter your email and password.';
      this.cdr.markForCheck();
      return;
    }

    this.isLoading = true;
    this.cdr.markForCheck();

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.authService.saveToken(res.token);
        this.cdr.markForCheck();
        this.router.navigateByUrl(this.returnUrl);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || err.error?.title || 'Login failed. Please check your credentials.';
        this.cdr.markForCheck();
      }
    });
  }
}
