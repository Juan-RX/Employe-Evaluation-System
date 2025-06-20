import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Puesto {
  id_Job: number;
  name_Job: string;
}

@Injectable({ providedIn: 'root' })
export class PuestoService {
  private baseUrl = `${environment.apiUrl}/Job`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.post<Puesto[]>(`${this.baseUrl}/GetAll`, {});
  }

  getById(id: number) {
    return this.http.post<Puesto>(`${this.baseUrl}/GetById`, id);
  }

  insert(puesto: Puesto) {
    return this.http.post<number>(`${this.baseUrl}/Insert`, puesto);
  }

  update(puesto: Puesto) {
    return this.http.post<number>(`${this.baseUrl}/Update`, puesto);
  }

  delete(id: number) {
    return this.http.post<number>(`${this.baseUrl}/Delete`, id);
  }
}
