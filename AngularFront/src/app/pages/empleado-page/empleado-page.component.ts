import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { PuestoService, Puesto } from '../../Services/Puesto.Service';
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
  private puestoService = inject(PuestoService);
  private cdr = inject(ChangeDetectorRef);

  empleados: Empleado[] = [];
  puestos: Puesto[] = [];
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
  filterName: string = '';
  filterLastName: string = '';
  filterBirthDate: string = '';
  filterContractDate: string = '';

  // Configuración de la tabla
  columns: TableColumn[] = [
    { key: 'id_Employee', label: 'Código', type: 'text' },
    { key: 'name_Employee', label: 'Nombre', type: 'text' },
    { key: 'lastName_Employee', label: 'Apellidos', type: 'text' },
    { key: 'birthDate', label: 'Fecha Nacimiento', type: 'date' },
    { key: 'contract_Start_Date', label: 'Inicio Contrato', type: 'date' },
    { key: 'nombrePuesto', label: 'Puesto', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit' },
    { icon: 'fas fa-trash', label: 'Eliminar', action: 'delete' }
  ];

  ngOnInit(): void {
    this.loadPuestos();
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

  loadPuestos() {
    this.puestoService.getAll().subscribe({
      next: (data) => {
        this.puestos = data;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error cargando puestos:', error);
      }
    });
  }

  getNombrePuesto(id: number): string {
    return this.puestos.find(p => p.id_Job === id)?.name_Job || '';
  }

  applySearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredEmpleados = this.empleados;
    } else {
      this.filteredEmpleados = this.empleados.filter(emp => {
        const nombre = emp.name_Employee.toLowerCase();
        const apellidos = emp.lastName_Employee.toLowerCase();
        const nombreCompleto = `${nombre} ${apellidos}`;
        const nombreCompletoInvertido = `${apellidos} ${nombre}`;
        return (
          nombre.includes(term) ||
          apellidos.includes(term) ||
          nombreCompleto.includes(term) ||
          nombreCompletoInvertido.includes(term) ||
          String(emp.id_Employee).toLowerCase().includes(term) ||
          String(emp.birthDate).toLowerCase().includes(term) ||
          String(emp.contract_Start_Date).toLowerCase().includes(term) ||
          this.getNombrePuesto(emp.id_Job).toLowerCase().includes(term)
        );
      });
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
    this.filteredEmpleados = this.empleados.filter(emp => {
      const nombreMatch = this.filterName ? emp.name_Employee.toLowerCase().includes(this.filterName.toLowerCase()) : true;
      const apellidoMatch = this.filterLastName ? emp.lastName_Employee.toLowerCase().includes(this.filterLastName.toLowerCase()) : true;
      const birthDateMatch = this.filterBirthDate ? String(emp.birthDate).startsWith(this.filterBirthDate) : true;
      const contractDateMatch = this.filterContractDate ? String(emp.contract_Start_Date).startsWith(this.filterContractDate) : true;
      const puestoMatch = this.filterJob ? this.getNombrePuesto(emp.id_Job).toLowerCase().includes(this.filterJob.toLowerCase()) : true;
      return nombreMatch && apellidoMatch && birthDateMatch && contractDateMatch && puestoMatch;
    });
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
    this.currentPage = 1; // Siempre volver a la primera página
    this.updatePagination();
    this.cdr.markForCheck();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredEmpleados.length / this.itemsPerPage) || 1;
    // Si la página actual es mayor que el total, vuelve a la última válida
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages;
    }
  }

  get paginatedEmpleados(): Empleado[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredEmpleados.slice(startIndex, endIndex).map(emp => ({
      ...emp,
      nombrePuesto: this.getNombrePuesto(emp.id_Job)
    }));
  }
}
