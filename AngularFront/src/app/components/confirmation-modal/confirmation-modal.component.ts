import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent {
  @Input() isOpen = false;
  @Input() title = 'Confirmar Acción';
  @Input() message = '¿Está seguro de que desea realizar esta acción?';
  @Input() confirmButtonText = 'Confirmar';
  @Input() cancelButtonText = 'Cancelar';
  @Input() confirmButtonClass = 'btn-danger';
  @Input() loading = false;

  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();

  confirm() {
    this.onConfirm.emit();
  }

  cancel() {
    this.onCancel.emit();
  }
} 