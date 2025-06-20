// src/app/login-page/login-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../Services/Auth.Service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ ReactiveFormsModule, CommonModule],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  loginForm: FormGroup;
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      userPassword: ['']
    });
  }

  login() {
    if (this.loginForm.invalid) return;

    this.errorMsg = '';
    const creds = this.loginForm.value;
    this.authService.login(creds).subscribe({
      next: () => {
        // Al recibir token, redirigimos
        this.router.navigate(['/home']); // o la ruta que quieras
      },
      error: err => {
        // Manejo de error
        this.errorMsg = err.status === 401
          ? 'Usuario o contraseña incorrectos'
          : 'Error al conectar con el servidor';
      }
    });
  }
}
