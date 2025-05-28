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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

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
  loginForm!: FormGroup; // Declare type but don't initialize here
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const hasToken = this.authService.hasToken();
    console.log('Has token:', hasToken);
    if (hasToken) {
      console.log('User is authenticated');
    } else {
      console.log('User is not authenticated');
    }
  }
  onSubmit() {
    const { email, password } = this.loginForm.value;

    console.log('Login credentials:', email + '  ' + password);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    console.log('Form is valid, proceeding with login');

    this.loading = true;

    console.log('Form submitted:', this.loginForm.value);
    this.authService.login(email, password).subscribe({
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
        const role = decoded?.user?.role || 'employee'; // Default to 'employee' if role is not found
        this.authService.setUserRole(role.toLowerCase());

        const userId = decoded?.user?._id;
        this.authService.setUserID(userId); // Fixed method name
        console.log('userId :', userId);

        console.log('role :', role);
        this.router.navigate([`/${role}/dashboard`]);
        this.loading = false;
        console.log('localStorage login ', localStorage);
      },
      error: (err) => {
        alert('Login failed: ' + err.error.message);
        this.loading = false;
      },
    });
  }

  goToDashboard() {
    console.log('Navigating to dashboard page');

    this.router.navigate(['/dashboard']);
  }
}
