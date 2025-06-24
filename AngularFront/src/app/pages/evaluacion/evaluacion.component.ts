// src/app/pages/evaluacion/evaluacion.component.ts
import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { EmpleadoFormComponent } from '../../components/empleado-form/empleado-form.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { EvaluacionService, Evaluacion } from '../../Services/Evaluacion.Service';

@Component({
  selector: 'app-evaluacion',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DataTableComponent, ModalComponent, EmpleadoFormComponent, ConfirmationModalComponent],
  templateUrl: './evaluacion.component.html',
  styleUrl: './evaluacion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);
  private router = inject(Router);
  private evaluacionService = inject(EvaluacionService);

  empleados: Empleado[] = [];
  loading = false;
  showModal = false;
  selectedEmpleado: Empleado | null = null;
  empleadoToDelete: Empleado | null = null;
  showDeleteModal = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  pageSizeOptions = [5, 10, 25, 50];
  searchTerm: string = '';
  filteredEmpleados: any[] = [];
  evaluaciones: Evaluacion[] = [];
  empleadosEvaluados: any[] = [];
  selectedEvaluacion: Evaluacion | null = null;
  showEvaluacionModal = false;

  columns: TableColumn[] = [
    { key: 'evaluation_Date', label: 'Fecha Evaluación', type: 'date' },
    { key: 'id_employee', label: 'Código', type: 'text' },
    { key: 'name_Employee', label: 'Nombre', type: 'text' },
    { key: 'lastName_Employee', label: 'Apellido', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-eye', label: 'Ver', action: 'view' },
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit' },
    { icon: 'fas fa-trash', label: 'Borrar', action: 'delete' }
  ];

  ngOnInit(): void {
    this.loadEvaluaciones();
  }

  loadEvaluaciones() {
    this.loading = true;
    this.evaluacionService.getAll().subscribe({
      next: (data) => {
        this.evaluaciones = data;
        this.empleadosEvaluados = data;
        this.filteredEmpleados = [...this.empleadosEvaluados];
        this.updatePagination();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error cargando evaluaciones:', error);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applySearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredEmpleados = [...this.empleados];
    } else {
      this.filteredEmpleados = this.empleados.filter(emp =>
        Object.keys(emp).some(key =>
          ['id_Employee', 'name_Employee', 'lastName_Employee'].includes(key) &&
          String((emp as any)[key]).toLowerCase().includes(term)
        )
      );
    }
    this.updatePagination();
  }

  onSearch(searchTerm: string) {
    this.searchTerm = searchTerm;
    this.applySearch();
    this.currentPage = 1;
    this.cdr.markForCheck();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmpleados.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  onFilter() {
    // Implementar filtros avanzados
  }

  onAdd() {
    this.router.navigate(['/resultados']);
  }

  onAction(event: { action: string, item: any }) {
    const evaluacion = event.item;
    switch (event.action) {
      case 'view':
        // Navegar a la gráfica de la evaluación seleccionada
        this.router.navigate(['/graphic-page', evaluacion.id_Evaluation]);
        break;
      case 'edit':
        // Navegar a la edición de la evaluación seleccionada
        this.router.navigate(['/resultados'], { queryParams: { id: evaluacion.id_Evaluation } });
        break;
      case 'delete':
        // Eliminar la evaluación seleccionada
        this.evaluacionService.delete(evaluacion.id_Evaluation!).subscribe({
          next: () => this.loadEvaluaciones(),
          error: (err) => console.error('Error eliminando evaluación:', err)
        });
        break;
    }
  }

  deleteEmpleado() {
    if (!this.empleadoToDelete) return;

    this.empleadoService.delete(this.empleadoToDelete.id_Employee).subscribe({
      next: () => {
        this.loadEvaluaciones();
        this.closeDeleteModal();
      },
      error: (error: any) => {
        console.error('Error eliminando empleado:', error);
        this.closeDeleteModal();
      }
    });
  }

  closeDeleteModal() {
    this.empleadoToDelete = null;
    this.showDeleteModal = false;
  }

  closeEvaluacionModal() {
    this.selectedEvaluacion = null;
    this.showEvaluacionModal = false;
  }

  onModalClose() {
    this.showModal = false;
    this.selectedEmpleado = null;
  }

  onSaveEmpleado(empleado: Empleado) {
    if (this.selectedEmpleado) {
      this.empleadoService.update(empleado).subscribe({
        next: () => {
          this.onModalClose();
          this.loadEvaluaciones();
        },
        error: (error: any) => {
          console.error('Error actualizando empleado:', error);
        }
      });
    } else {
      this.empleadoService.insert(empleado).subscribe({
        next: () => {
          this.onModalClose();
          this.loadEvaluaciones();
        },
        error: (error: any) => {
          console.error('Error creando empleado:', error);
        }
      });
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.cdr.markForCheck();
  }

  onItemsPerPageChange(newSize: number) {
    this.itemsPerPage = newSize;
    this.currentPage = 1;
    this.updatePagination();
    this.cdr.markForCheck();
  }

  get paginatedEmpleados(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmpleados.slice(startIndex, endIndex);
  }
}
