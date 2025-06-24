import { ChangeDetectionStrategy, Component, inject, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormsModule } from '@angular/forms';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { EvaluacionService } from '../../Services/Evaluacion.Service';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, takeUntil, catchError, tap, filter } from 'rxjs/operators';
import { of } from 'rxjs';
import type { Evaluacion } from '../../Services/Evaluacion.Service';
import { Router, ActivatedRoute } from '@angular/router';
import { RadarChartComponent } from '../../components/radar-chart.component';

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
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RadarChartComponent],
  templateUrl: './resultados-page.component.html',
  styleUrl: './resultados-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadosPageComponent implements OnInit, OnDestroy {
  private empleadoService = inject(EmpleadoService);
  private evaluacionService = inject(EvaluacionService);
  private destroy$ = new Subject<void>();
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  // Modelo del formulario
  idEmpleadoControl = new FormControl('', { nonNullable: true });
  nombreEmpleado = '';
  comentarios = '';
  isLoading = false;
  errorMensaje = '';
  empleadoValido: Empleado | null = null;
  isEditMode = false;
  idEvaluacionEdit: number | null = null;

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

  evaluaciones: Evaluacion[] = [];
  tableColumns: import('../../components/data-table/data-table.component').TableColumn[] = [
    { key: 'evaluation_Date', label: 'Fecha Evaluación', type: 'date' },
    { key: 'id_Evaluation', label: 'Código', type: 'number' },
    { key: 'name_Employee', label: 'Nombre', type: 'text' },
    { key: 'lastName_Employee', label: 'Apellido', type: 'text' },
    { key: 'id_employee', label: 'ID Empleado', type: 'number' },
    { key: 'productivity', label: 'Productividad', type: 'number' },
    { key: 'punctuality', label: 'Puntualidad', type: 'number' },
    { key: 'work_quality', label: 'Calidad', type: 'number' },
    { key: 'communication', label: 'Comunicación', type: 'number' },
    { key: 'willingness_to_learn', label: 'Aprender', type: 'number' },
    { key: 'honesty', label: 'Honestidad', type: 'number' },
    { key: 'initiative', label: 'Iniciativa', type: 'number' },
    { key: 'teamwork', label: 'Equipo', type: 'number' },
    { key: 'comments', label: 'Comentarios', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' }
  ];

  // Paginación simple
  itemsPerPage = 10;
  currentPage = 1;
  get paginatedEvaluaciones() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.evaluaciones.slice(start, start + this.itemsPerPage);
  }
  get totalPages() {
    return Math.ceil(this.evaluaciones.length / this.itemsPerPage) || 1;
  }
  get totalItems() {
    return this.evaluaciones.length;
  }
  onPageChange(page: number) {
    this.currentPage = page;
  }
  onItemsPerPageChange(size: number) {
    this.itemsPerPage = size;
    this.currentPage = 1;
  }

  actions = [
    { icon: 'fas fa-chart-pie', label: 'Ver gráfica', action: 'view-graphic' }
  ];

  // Estado para la evaluación seleccionada
  selectedEvaluacion: Evaluacion | null = null;

  get radarLabels(): string[] {
    return [
      'Productividad',
      'Puntualidad',
      'Calidad del Trabajo',
      'Buena comunicación',
      'Disposición a aprender',
      'Honestidad',
      'Iniciativa',
      'Integración con el equipo'
    ];
  }

  get radarData(): number[] {
    const ev = this.selectedEvaluacion;
    return ev ? [
      Number(ev.productivity) || 0,
      Number(ev.punctuality) || 0,
      Number(ev.work_quality) || 0,
      Number(ev.communication) || 0,
      Number(ev.willingness_to_learn) || 0,
      Number(ev.honesty) || 0,
      Number(ev.initiative) || 0,
      Number(ev.teamwork) || 0
    ] : [];
  }

  ngOnInit(): void {
    // Detectar modo edición por parámetro 'id'
    const idParam = this.route.snapshot.queryParamMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.idEvaluacionEdit = Number(idParam);
      this.evaluacionService.getById(this.idEvaluacionEdit).subscribe(ev => {
        if (ev) {
          this.idEmpleadoControl.setValue(ev.id_employee.toString());
          this.nombreEmpleado = `${ev.name_Employee || ''} ${ev.lastName_Employee || ''}`.trim();
          this.comentarios = ev.comments;
          this.valores = {
            Productividad: Number(ev.productivity) || 0,
            Puntualidad: Number(ev.punctuality) || 0,
            Calidad: Number(ev.work_quality) || 0,
            Comunicacion: Number(ev.communication) || 0,
            Aprender: Number(ev.willingness_to_learn) || 0,
            Honestidad: Number(ev.honesty) || 0,
            Iniciativa: Number(ev.initiative) || 0,
            Equipo: Number(ev.teamwork) || 0
          };
          this.empleadoValido = {
            id_Employee: ev.id_employee,
            name_Employee: ev.name_Employee || '',
            lastName_Employee: ev.lastName_Employee || '',
            birthDate: '',
            contract_Start_Date: '',
            id_Job: 0
          };
        }
      });
    }

    // Obtener todas las evaluaciones al iniciar
    this.evaluacionService.getAll().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.evaluaciones = (data || []).map(ev => {
          const mappedEv = {
            ...ev,
            id_Evaluation: ev.id_Evaluation ?? (ev as any)['id_evaluation'],
            evaluation_Date: ev.evaluation_Date // Mantener como string ISO
          };
          return mappedEv;
        });
      },
      error: (error) => {
        this.evaluaciones = [];
      }
    });
  }

  limpiarEstadoEmpleado() {
    this.nombreEmpleado = '';
    this.empleadoValido = null;
    for (const key of Object.keys(this.valores) as ClaveComp[]) {
      this.valores[key] = 0;
    }
    this.comentarios = '';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit() {
    if (!this.idEmpleadoControl.value || !this.nombreEmpleado || !this.empleadoValido) {
      this.errorMensaje = 'Debe seleccionar un empleado válido.';
      return;
    }
    const evaluacion = {
      id_employee: this.empleadoValido.id_Employee,
      name_Employee: this.empleadoValido.name_Employee,
      lastName_Employee: this.empleadoValido.lastName_Employee,
      productivity: this.valores.Productividad,
      punctuality: this.valores.Puntualidad,
      work_quality: this.valores.Calidad,
      communication: this.valores.Comunicacion,
      willingness_to_learn: this.valores.Aprender,
      honesty: this.valores.Honestidad,
      initiative: this.valores.Iniciativa,
      teamwork: this.valores.Equipo,
      comments: this.comentarios,
      evaluation_Date: new Date().toISOString()
    };
    if (this.isEditMode && this.idEvaluacionEdit) {
      (evaluacion as any).id_Evaluation = this.idEvaluacionEdit;
      this.evaluacionService.update(evaluacion).subscribe({
        next: () => {
          this.errorMensaje = '';
          alert('¡Evaluación actualizada exitosamente!');
          this.onCancel();
        },
        error: (err) => {
          this.errorMensaje = 'Error al actualizar la evaluación.';
        }
      });
    } else {
      this.evaluacionService.insert(evaluacion).subscribe({
        next: () => {
          this.errorMensaje = '';
          alert('¡Evaluación guardada exitosamente!');
          this.router.navigate(['/evaluacion']);
        },
        error: (err) => {
          this.errorMensaje = 'Error al guardar la evaluación.';
        }
      });
    }
  }

  onCancel() {
    this.idEmpleadoControl.setValue('');
    this.limpiarEstadoEmpleado();
    this.errorMensaje = '';
  }

  onTableAction(event: { action: string, item: Evaluacion }) {
    if (event.action === 'view-graphic') {
      this.selectedEvaluacion = event.item;
    }
  }

  buscarEmpleado() {
    this.isLoading = true;
    this.errorMensaje = '';
    this.empleadoValido = null;
    this.nombreEmpleado = '';
    const id = this.idEmpleadoControl.value;
    if (!id || !/^[0-9]+$/.test(id)) {
      this.isLoading = false;
      this.errorMensaje = 'Ingrese un ID de empleado válido.';
      this.cdr.markForCheck();
      return;
    }
    this.empleadoService.getById(Number(id)).subscribe({
      next: (empleado) => {
        if (empleado) {
          this.nombreEmpleado = `${empleado.name_Employee} ${empleado.lastName_Employee}`;
          this.empleadoValido = empleado;
          this.errorMensaje = '';
        } else {
          this.errorMensaje = 'Empleado no encontrado.';
          this.nombreEmpleado = '';
          this.empleadoValido = null;
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMensaje = 'Empleado no encontrado o error en la solicitud.';
        this.nombreEmpleado = '';
        this.empleadoValido = null;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}
