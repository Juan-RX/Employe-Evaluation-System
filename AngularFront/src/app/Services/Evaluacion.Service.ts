import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Evaluacion {
  id_Evaluation?: number;
  id_employee: number;
  evaluation_Date?: string | Date;
  productivity: number;
  punctuality: number;
  work_quality: number;
  communication: number;
  willingness_to_learn: number;
  honesty: number;
  initiative: number;
  teamwork: number;
  comments: string;
  name_Employee?: string;
  lastName_Employee?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {
  private apiUrl = environment.apiUrl + '/Evaluation';

  constructor(private http: HttpClient) { }

  getAll(): Observable<Evaluacion[]> {
    return this.http.post<Evaluacion[]>(`${this.apiUrl}/GetAll`, {});
  }

  getById(id: number): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.apiUrl}/GetById`, id);
  }

  insert(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.apiUrl}/Insert`, evaluacion);
  }

  update(evaluacion: Evaluacion): Observable<Evaluacion> {
    return this.http.post<Evaluacion>(`${this.apiUrl}/Update`, evaluacion);
  }

  delete(id: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/Delete`, id);
  }
}
