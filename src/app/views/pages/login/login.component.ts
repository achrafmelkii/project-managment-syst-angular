import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { IconDirective } from '@coreui/icons-angular';
import { routes } from '../../../app.routes';
import { Router } from '@angular/router';
import {
  ContainerComponent,
  RowComponent,
  ColComponent,
  CardGroupComponent,
  TextColorDirective,
  CardComponent,
  CardBodyComponent,
  FormDirective,
  InputGroupComponent,
  InputGroupTextDirective,
  FormControlDirective,
  ButtonDirective,
} from '@coreui/angular';
import { ReactiveFormsModule } from '@angular/forms';

import { jwtDecode } from 'jwt-decode';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    ContainerComponent,
    RowComponent,
    ColComponent,
    CardGroupComponent,
    TextColorDirective,
    CardComponent,
    CardBodyComponent,
    FormDirective,
    InputGroupComponent,
    InputGroupTextDirective,
    IconDirective,
    FormControlDirective,
    ButtonDirective,
    ReactiveFormsModule,
    NgStyle,
  ],
})
export class LoginComponent {
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    const credentials = {
      email: this.loginForm.get('email')?.value || '',
      password: this.loginForm.get('password')?.value || '',
    };
    console.log(
      'Login credentials:',
      credentials.email + '  ' + this.loginForm.invalid
    );

    if (this.loginForm.invalid) return;
    console.log('Form is valid, proceeding with login');

    this.loading = true;

    console.log('Form submitted:', this.loginForm.value);
    this.authService.login(credentials.email, credentials.password).subscribe({
      next: (res) => {
        const token = res.token;
        this.authService.setToken(token);
        console.log('Token set in local storage:', token);

        localStorage.setItem('isAuthenticated', 'isAuthenticated');
        console.log(
          'User authenticated:',
          localStorage.getItem('isAuthenticated')
        );

        const decoded: any = jwtDecode(token);
        const role = decoded?.user?.role || 'default';
        this.router.navigate([`/${role}`]);
        this.loading = false;
      },
      error: (err) => {
        alert('Login failed: ' + err.error.message);
        this.loading = false;
      },
    });
  }
  goToRegister() {
    console.log('Navigating to register page');

    this.router.navigate(['/register']);
  }

  goToDashboard() {
    console.log('Navigating to dashboard page');

    this.router.navigate(['/dashboard']);
  }
}
