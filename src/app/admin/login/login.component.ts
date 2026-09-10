import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// ── Admin Credentials ─────────────────────────────────────────
// Username: admin@aridhu.com
// Password: Aridhu@2024
// ─────────────────────────────────────────────────────────────

@Component({
  selector: 'app-admin-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class AdminLoginComponent {
  form: FormGroup;
  showPassword = false;
  loginError = '';
  loading = false;

  // Valid credentials
  private readonly ADMIN_EMAIL = 'admin@aridhu.com';
  private readonly ADMIN_PASS  = 'Aridhu@2024';

  constructor(private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      email:    ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;
    this.loginError = '';

    // Simulate slight delay for UX
    setTimeout(() => {
      const { email, password } = this.form.value;
      if (email === this.ADMIN_EMAIL && password === this.ADMIN_PASS) {
        localStorage.setItem('aridhu_admin_auth', 'true');
        this.router.navigate(['/admin/dashboard']);
      } else {
        this.loginError = 'Invalid credentials. Please check your email and password.';
        this.loading = false;
      }
    }, 700);
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  getError(field: string, error: string): boolean {
    const c = this.form.get(field);
    return !!(c && c.touched && c.hasError(error));
  }
}
