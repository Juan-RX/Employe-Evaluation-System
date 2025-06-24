// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

interface Credentials {
  username: string;
  userPassword: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = `${environment.apiUrl}/UserLogin`;

  constructor(private http: HttpClient) {}

  login(creds: Credentials): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.baseUrl}/Login`, creds)
      .pipe(
        tap(res => {
          // Guardamos el token en localStorage
          localStorage.setItem('jwtToken', res.token);
        })
      );
  }

  logout() {
    localStorage.removeItem('jwtToken');
    // opcional: redirigir o limpiar otros estados
  }

  getToken(): string | null {
    const token = localStorage.getItem('jwtToken');
    if (!token || token === 'null' || token === 'undefined') return null;
    return token;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
