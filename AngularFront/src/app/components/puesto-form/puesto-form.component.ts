import { Component, Input, Output, EventEmitter, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PuestoService, Puesto } from '../../Services/Puesto.Service';

@Component({
  selector: 'app-puesto-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './puesto-form.component.html',
  styleUrls: ['./puesto-form.component.css']
})
export class PuestoFormComponent implements OnInit, OnChanges {
  @Input() puesto: Puesto | null = null;
  @Input() isEdit: boolean = false;
  @Output() onSave = new EventEmitter<Puesto>();
  @Output() onCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);

  puestoForm!: FormGroup;
  loading = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['puesto'] && this.puestoForm) {
      this.initForm();
    }
  }

  initForm(): void {
    this.puestoForm = this.fb.group({
      id_Job: [this.puesto?.id_Job || 0],
      name_Job: [this.puesto?.name_Job || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
    });
  }

  onSubmit(): void {
    if (this.puestoForm.valid) {
      this.loading = true;
      const puestoData: Puesto = this.puestoForm.value;
      
      this.onSave.emit(puestoData);
      this.loading = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  markFormGroupTouched(): void {
    Object.keys(this.puestoForm.controls).forEach(key => {
      const control = this.puestoForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.puestoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
      if (field.errors['maxlength']) {
        return `Máximo ${field.errors['maxlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.puestoForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
} 