// src/app/pages/evaluacion/evaluacion.component.ts
import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-evaluacion',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);

  empleados: Empleado[] = [];

  ngOnInit(): void {
    this.empleadoService.getAll().subscribe(data => {
      this.empleados = data;
      this.cdr.markForCheck();
    });
  }

  abrirEvaluacion(emp: Empleado) {
    this.router.navigate(['/evaluacion/form'], { state: { empleado: emp } });
  }
}
