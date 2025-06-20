import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isOpen: boolean = false;
  @Input() title: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() showCloseButton: boolean = true;
  @Input() closeOnBackdrop: boolean = true;

  @Output() onClose = new EventEmitter<void>();

  onBackdropClick() {
    if (this.closeOnBackdrop) {
      this.close();
    }
  }

  close() {
    this.onClose.emit();
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
} 