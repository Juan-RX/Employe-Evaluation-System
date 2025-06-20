import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { EmpleadoFormComponent } from '../../components/empleado-form/empleado-form.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-empleado-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DataTableComponent, ModalComponent, EmpleadoFormComponent, FormsModule, ConfirmationModalComponent],
  templateUrl: './empleado-page.component.html',
  styleUrl: './empleado-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoPageComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);

  empleados: Empleado[] = [];
  loading = false;
  showModal = false;
  selectedEmpleado: Empleado | null = null;
  empleadoToDelete: Empleado | null = null;
  showDeleteModal = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  searchTerm: string = '';
  filteredEmpleados: Empleado[] = [];
  showFilterModal = false;
  filterJob: string = '';

  // Configuración de la tabla
  columns: TableColumn[] = [
    { key: 'id_Employee', label: 'Código', type: 'text' },
    { key: 'name_Employee', label: 'Nombre', type: 'text' },
    { key: 'lastName_Employee', label: 'Apellidos', type: 'text' },
    { key: 'birthDate', label: 'Fecha Nacimiento', type: 'date' },
    { key: 'contract_Start_Date', label: 'Inicio Contrato', type: 'date' },
    { key: 'id_Job', label: 'Puesto', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit' },
    { icon: 'fas fa-trash', label: 'Eliminar', action: 'delete' }
  ];

  ngOnInit(): void {
    this.loadEmpleados();
  }

  loadEmpleados() {
    this.loading = true;
    this.empleadoService.getAll().subscribe({
      next: (data) => {
        this.empleados = data;
        this.applySearch();
        this.updatePagination();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error cargando empleados:', error);
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
          ['id_Employee', 'name_Employee', 'lastName_Employee', 'birthDate', 'contract_Start_Date', 'id_Job'].includes(key) &&
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

  onFilter() {
    this.showFilterModal = true;
  }

  closeFilterModal() {
    this.showFilterModal = false;
  }

  applyAdvancedFilter() {
    if (this.filterJob) {
      this.filteredEmpleados = this.empleados.filter(emp => String((emp as any)['id_Job']) === this.filterJob);
    } else {
      this.applySearch();
    }
    this.updatePagination();
    this.showFilterModal = false;
    this.cdr.markForCheck();
  }

  onAdd() {
    this.selectedEmpleado = null;
    this.showModal = true;
  }

  onAction(event: { action: string, item: any }) {
    const empleado = event.item as Empleado;
    
    switch (event.action) {
      case 'edit':
        this.selectedEmpleado = empleado;
        this.showModal = true;
        break;
      case 'delete':
        this.empleadoToDelete = empleado;
        this.showDeleteModal = true;
        break;
    }
  }

  deleteEmpleado() {
    if (!this.empleadoToDelete) return;

    this.empleadoService.delete(this.empleadoToDelete.id_Employee).subscribe({
      next: () => {
        console.log('Empleado eliminado correctamente');
        this.loadEmpleados();
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

  onModalClose() {
    this.showModal = false;
    this.selectedEmpleado = null;
  }

  onSaveEmpleado(empleado: Empleado) {
    if (this.selectedEmpleado) {
      // Actualizar empleado existente
      this.empleadoService.update(empleado).subscribe({
        next: () => {
          console.log('Empleado actualizado correctamente');
          this.onModalClose();
          this.loadEmpleados();
        },
        error: (error: any) => {
          console.error('Error actualizando empleado:', error);
        }
      });
    } else {
      // Crear nuevo empleado
      this.empleadoService.insert(empleado).subscribe({
        next: () => {
          console.log('Empleado creado correctamente');
          this.onModalClose();
          this.loadEmpleados();
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
    this.currentPage = 1; // Volver a la primera página
    this.updatePagination();
    this.cdr.markForCheck();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmpleados.length / this.itemsPerPage);
    // Asegurar que la página actual sea válida
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  get paginatedEmpleados(): Empleado[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmpleados.slice(startIndex, endIndex);
  }
}
