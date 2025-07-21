import {Component, OnDestroy} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../core/auth/auth.service";
import {Router} from "@angular/router";
import {CommonModule} from "@angular/common";
import {takeWhile} from "rxjs";

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true
})
export class LoginComponent implements OnDestroy{
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  loading = false;
  error: any;
  alive = true;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    try {
      const email = this.loginForm.value.email!;
      const password = this.loginForm.value.password!;
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (err: unknown) {
      this.errorMessage = 'Login failed. Please check your credentials.';
      console.error(err);
    }
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
