import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { PuestoService, Puesto } from '../../Services/Puesto.Service';
import { DataTableComponent, TableColumn, TableAction } from '../../components/data-table/data-table.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PuestoFormComponent } from '../../components/puesto-form/puesto-form.component';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-puesto-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule, DataTableComponent, ModalComponent, PuestoFormComponent, ConfirmationModalComponent, FormsModule],
  templateUrl: './puesto-page.component.html',
  styleUrl: './puesto-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuestoPageComponent implements OnInit {
  private puestoService = inject(PuestoService);
  private cdr = inject(ChangeDetectorRef);

  puestos: Puesto[] = [];
  filteredPuestos: Puesto[] = [];
  loading = false;
  showModal = false;
  selectedPuesto: Puesto | null = null;
  puestoToDelete: Puesto | null = null;
  showDeleteModal = false;
  currentPage = 1;
  totalPages = 1;
  itemsPerPage = 10;
  showFilterModal = false;
  filterId: string = '';
  filterName: string = '';
  searchTerm: string = '';
  showDeleteErrorModal = false;
  deleteErrorMessage = '';

  // Configuración de la tabla
  columns: TableColumn[] = [
    { key: 'id_Job', label: 'Código', type: 'text' },
    { key: 'name_Job', label: 'Nombre del Puesto', type: 'text' },
    { key: 'actions', label: 'Acciones', type: 'actions' }
  ];

  actions: TableAction[] = [
    { icon: 'fas fa-edit', label: 'Editar', action: 'edit' },
    { icon: 'fas fa-trash', label: 'Eliminar', action: 'delete' }
  ];

  ngOnInit(): void {
    this.loadPuestos();
  }

  loadPuestos() {
    this.loading = true;
    this.puestoService.getAll().subscribe({
      next: (data) => {
        this.puestos = data;
        this.applySearch();
        this.updatePagination();
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
  }

  applySearch() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredPuestos = [...this.puestos];
    } else {
      this.filteredPuestos = this.puestos.filter(puesto =>
        String(puesto.id_Job).toLowerCase().includes(term) ||
        puesto.name_Job.toLowerCase().includes(term)
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
    this.filteredPuestos = this.puestos.filter(puesto => {
      const idMatch = this.filterId ? String(puesto.id_Job).includes(this.filterId) : true;
      const nameMatch = this.filterName ? puesto.name_Job.toLowerCase().includes(this.filterName.toLowerCase()) : true;
      return idMatch && nameMatch;
    });
    this.updatePagination();
    this.showFilterModal = false;
    this.cdr.markForCheck();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.filteredPuestos.length / this.itemsPerPage);
    // Asegurar que la página actual sea válida
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  onAdd() {
    this.selectedPuesto = null;
    this.showModal = true;
  }

  onAction(event: { action: string, item: any }) {
    const puesto = event.item as Puesto;
    
    switch (event.action) {
      case 'edit':
        this.selectedPuesto = puesto;
        this.showModal = true;
        break;
      case 'delete':
        this.puestoToDelete = puesto;
        this.showDeleteModal = true;
        break;
    }
  }

  deletePuesto() {
    if (!this.puestoToDelete) return;
    const id = this.puestoToDelete.id_Job;
    this.closeDeleteModal();
    this.puestoService.delete(id).subscribe({
      next: () => {
        this.loadPuestos();
      },
      error: (error: any) => {
        this.deleteErrorMessage = error?.error?.message || 'No se puede eliminar el puesto porque hay empleados asociados a él.';
        this.showDeleteErrorModal = true;
      }
    });
  }

  closeDeleteModal() {
    this.puestoToDelete = null;
    this.showDeleteModal = false;
  }

  closeDeleteErrorModal() {
    this.showDeleteErrorModal = false;
    this.deleteErrorMessage = '';
    this.closeDeleteModal();
    this.loadPuestos();
  }

  onModalClose() {
    this.showModal = false;
    this.selectedPuesto = null;
  }

  onSavePuesto(puesto: Puesto) {
    if (this.selectedPuesto) {
      // Actualizar puesto existente
      this.puestoService.update(puesto).subscribe({
        next: () => {
          this.onModalClose();
          this.loadPuestos();
        },
        error: (error: any) => {
        }
      });
    } else {
      // Crear nuevo puesto
      this.puestoService.insert(puesto).subscribe({
        next: () => {
          this.onModalClose();
          this.loadPuestos();
        },
        error: (error: any) => {
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

  get paginatedPuestos(): Puesto[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredPuestos.slice(startIndex, endIndex);
  }
}