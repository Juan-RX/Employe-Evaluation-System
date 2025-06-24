// src/app/login-page/login-page.component.ts
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  triedLogin = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      userPassword: ['', Validators.required]
    });

    // Limpiar error al escribir
    this.loginForm.valueChanges.subscribe(() => {
      if (this.triedLogin) this.errorMsg = '';
    });
  }

  login() {
    this.triedLogin = true;
    if (this.loginForm.invalid) {
      this.errorMsg = 'Debes ingresar usuario y contraseña.';
      return;
    }

    this.errorMsg = '';
    const creds = this.loginForm.value;
    this.authService.login(creds).subscribe({
      next: () => {
        this.router.navigate(['/home']);
      },
      error: err => {
        if (err.status === 401) {
          this.errorMsg = 'Usuario o contraseña incorrectos.';
        } else if (err.status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor. Verifica tu conexión.';
        } else {
          this.errorMsg = 'Ocurrió un error inesperado. Intenta de nuevo.';
        }
      }
    });
  }
}
