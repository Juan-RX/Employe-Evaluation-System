import { Component, Input, Output, EventEmitter, OnInit, inject, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { PuestoService, Puesto } from '../../Services/Puesto.Service';

@Component({
  selector: 'app-empleado-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './empleado-form.component.html',
  styleUrls: ['./empleado-form.component.css']
})
export class EmpleadoFormComponent implements OnInit, OnChanges {
  @Input() empleado: Empleado | null = null;
  @Input() isEdit: boolean = false;
  @Output() onSave = new EventEmitter<Empleado>();
  @Output() onCancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private empleadoService = inject(EmpleadoService);
  private puestoService = inject(PuestoService);

  empleadoForm!: FormGroup;
  puestos: Puesto[] = [];
  loading = false;

  ngOnInit(): void {
    this.initForm();
    this.loadPuestos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['empleado'] && this.empleadoForm) {
      this.initForm();
    }
  }

  initForm(): void {
    this.empleadoForm = this.fb.group({
      id_Employee: [this.empleado?.id_Employee || 0],
      name_Employee: [this.empleado?.name_Employee || '', [Validators.required, Validators.minLength(2)]],
      lastName_Employee: [this.empleado?.lastName_Employee || '', [Validators.required, Validators.minLength(2)]],
      birthDate: [this.formatDate(this.empleado?.birthDate), [Validators.required]],
      contract_Start_Date: [this.formatDate(this.empleado?.contract_Start_Date), [Validators.required]],
      id_Job: [this.empleado?.id_Job || '', [Validators.required]]
    });
  }

  private formatDate(date: string | undefined): string {
    if (!date) return '';
    try {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = ('0' + (d.getMonth() + 1)).slice(-2);
      const day = ('0' + d.getDate()).slice(-2);
      if (isNaN(year)) return '';
      return `${year}-${month}-${day}`;
    } catch (e) {
      return '';
    }
  }

  loadPuestos(): void {
    this.puestoService.getAll().subscribe({
      next: (data) => {
        this.puestos = data;
      },
      error: (error) => {
        console.error('Error cargando puestos:', error);
      }
    });
  }

  onSubmit(): void {
    if (this.empleadoForm.valid) {
      this.loading = true;
      const empleadoData: Empleado = this.empleadoForm.value;
      
      this.onSave.emit(empleadoData);
      this.loading = false;
    } else {
      this.markFormGroupTouched();
    }
  }

  onCancelClick(): void {
    this.onCancel.emit();
  }

  markFormGroupTouched(): void {
    Object.keys(this.empleadoForm.controls).forEach(key => {
      const control = this.empleadoForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.empleadoForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return 'Este campo es requerido';
      }
      if (field.errors['minlength']) {
        return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
      }
    }
    return '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.empleadoForm.get(fieldName);
    return !!(field?.invalid && field?.touched);
  }
} 