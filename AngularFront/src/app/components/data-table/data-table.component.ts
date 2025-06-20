import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'date' | 'number' | 'actions';
  sortable?: boolean;
}

export interface TableAction {
  icon: string;
  label: string;
  action: string;
  color?: string;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() searchPlaceholder: string = 'Buscar...';
  @Input() showSearch: boolean = true;
  @Input() showAddButton: boolean = true;
  @Input() showFilterButton: boolean = true;
  @Input() addButtonLabel: string = 'Agregar';
  @Input() loading: boolean = false;
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Input() actions: TableAction[] = [];
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() pageSizeOptions: number[] = [5, 10, 25, 50];

  @Output() onSearch = new EventEmitter<string>();
  @Output() onAdd = new EventEmitter<void>();
  @Output() onFilter = new EventEmitter<void>();
  @Output() onAction = new EventEmitter<{action: string, item: any}>();
  @Output() onPageChange = new EventEmitter<number>();
  @Output() onItemsPerPageChange = new EventEmitter<number>();

  searchTerm: string = '';

  onSearchChange() {
    this.onSearch.emit(this.searchTerm);
  }

  onAddClick() {
    this.onAdd.emit();
  }

  onFilterClick() {
    this.onFilter.emit();
  }

  onActionClick(action: string, item: any) {
    this.onAction.emit({ action, item });
  }

  onPageClick(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.onPageChange.emit(page);
    }
  }

  onPageSizeChange(event: any) {
    const newSize = parseInt(event.target.value);
    this.onItemsPerPageChange.emit(newSize);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  }

  get startItem(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endItem(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }

  get showPagination(): boolean {
    return this.totalItems > 0;
  }
} 