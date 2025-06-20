// src/app/services/empleado.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

export interface Empleado {
  id_Employee: number;
  name_Employee: string;
  lastName_Employee: string;
  birthDate: string;
  contract_Start_Date: string;
  id_Job: number;
}

@Injectable({ providedIn: 'root' })
export class EmpleadoService {
  private baseUrl = `${environment.apiUrl}/Employe`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.post<Empleado[]>(`${this.baseUrl}/GetAll`, {});
  }

  getById(id: number) {
    return this.http.post<Empleado>(`${this.baseUrl}/GetById`, id);
  }

  insert(empleado: Empleado) {
    return this.http.post(`${this.baseUrl}/Insert`, empleado);
  }

  update(empleado: Empleado) {
    return this.http.post(`${this.baseUrl}/Update`, empleado);
  }

  delete(id: number) {
    return this.http.post(`${this.baseUrl}/Delete`, id);
  }
}
