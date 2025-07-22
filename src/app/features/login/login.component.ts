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

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  onSubmit() {
    if (this.loginForm.invalid) return;
    this.loading = true;
    this.authService.login(this.loginForm.value).pipe(takeWhile(() => this.alive)).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => {
        this.error = err.error?.message || 'Login Failed';
        this.loading = false;
      }
    })
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
