import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, catchError, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';

enum Competencia {
  Productividad = 'Productividad',
  Puntualidad = 'Puntualidad',
  Calidad = 'Calidad del Trabajo',
  Comunicacion = 'Buena comunicación',
  Aprender = 'Disposición a aprender',
  Honestidad = 'Honestidad',
  Iniciativa = 'Iniciativa',
  Equipo = 'Integración con el equipo'
}

type ClaveComp = keyof typeof Competencia;

@Component({
  selector: 'app-resultados-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './resultados-page.component.html',
  styleUrl: './resultados-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadosPageComponent implements OnInit, OnDestroy {
  private empleadoService = inject(EmpleadoService);
  private destroy$ = new Subject<void>();

  // Modelo del formulario
  idEmpleadoControl = new FormControl('', { nonNullable: true });
  nombreEmpleado = '';
  comentarios = '';
  isLoading = false;
  errorMensaje = '';

  // Valores tipados
  valores: Record<ClaveComp, number> = {
    Productividad: 0,
    Puntualidad: 0,
    Calidad: 0,
    Comunicacion: 0,
    Aprender: 0,
    Honestidad: 0,
    Iniciativa: 0,
    Equipo: 0
  };

  // Generamos dinámicamente el listado de competencias
  competencias = Object.entries(Competencia) as [ClaveComp, string][];

  ngOnInit(): void {
    this.idEmpleadoControl.valueChanges.pipe(
      debounceTime(400),
      filter(value => !!value && /^\d+$/.test(value)),
      tap(() => {
        this.isLoading = true;
        this.nombreEmpleado = '';
        this.errorMensaje = '';
      }),
      switchMap(id =>
        this.empleadoService.getById(Number(id)).pipe(
          catchError(() => {
            this.errorMensaje = 'Empleado no encontrado o error en la solicitud.';
            return of(null);
          })
        )
      ),
      takeUntil(this.destroy$)
    ).subscribe(empleado => {
      this.isLoading = false;
      if (empleado) {
        this.nombreEmpleado = `${empleado.name_Employee} ${empleado.lastName_Employee}`;
        this.errorMensaje = '';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (!this.idEmpleadoControl.value || !this.nombreEmpleado) {
      this.errorMensaje = 'Debe seleccionar un empleado válido.';
      return;
    }
    const resultado = {
      codigo: this.idEmpleadoControl.value,
      nombre: this.nombreEmpleado,
      valores: { ...this.valores },
      comentarios: this.comentarios
    };
    console.log('Enviando evaluación:', resultado);
    // TODO: llamar a servicio HTTP aquí
  }

  onCancel() {
    this.idEmpleadoControl.setValue('');
    this.nombreEmpleado = '';
    this.comentarios = '';
    this.errorMensaje = '';
    for (const key of Object.keys(this.valores) as ClaveComp[]) {
      this.valores[key] = 0;
    }
  }
}
