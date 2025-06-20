import { Component, OnInit, ChangeDetectionStrategy, inject, ChangeDetectorRef } from '@angular/core';
import { PuestoService, Puesto } from '../../Services/Puesto.Service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-puesto-page',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './puesto-page.component.html',
  styleUrls: ['./puesto-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PuestoPageComponent implements OnInit {
  private puestoService = inject(PuestoService);
  private cdr = inject(ChangeDetectorRef);

  puestos: Puesto[] = [];

  ngOnInit(): void {
    this.puestoService.getAll().subscribe(data => {
      this.puestos = data;
      this.cdr.markForCheck();
    });
  }
}