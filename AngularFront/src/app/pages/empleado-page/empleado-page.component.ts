import { Component, ChangeDetectionStrategy, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-empleado-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './empleado-page.component.html',
  styleUrl: './empleado-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoPageComponent implements OnInit {
  private empleadoService = inject(EmpleadoService);
  private cdr = inject(ChangeDetectorRef);

  empleados: Empleado[] = [];

  ngOnInit(): void {
    this.empleadoService.getAll().subscribe(data => {
      this.empleados = data;
      this.cdr.markForCheck();
    });
  }
}
