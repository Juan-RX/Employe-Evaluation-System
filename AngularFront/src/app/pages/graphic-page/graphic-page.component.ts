import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EvaluacionService, Evaluacion } from '../../Services/Evaluacion.Service';
import { EmpleadoService, Empleado } from '../../Services/Empleado.Service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DxPolarChartModule } from 'devextreme-angular';

@Component({
  selector: 'app-graphic-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DxPolarChartModule],
  templateUrl: './graphic-page.component.html',
  styleUrl: './graphic-page.component.css'
})
export class GraphicPageComponent implements OnInit {
  evaluacion: Evaluacion | null = null;
  radarData: any[] = [];
  loading = true;
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private evaluacionService: EvaluacionService,
    private empleadoService: EmpleadoService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = this.route.snapshot.queryParamMap.get('edit') === 'true';
    this.evaluacionService.getById(id).subscribe({
      next: (ev) => {
        if (ev) {
          this.evaluacion = ev;
          // Si falta el nombre, consultamos el empleado
          if (!ev.name_Employee || !ev.lastName_Employee) {
            this.empleadoService.getById(ev.id_employee).subscribe({
              next: (emp: Empleado) => {
                this.evaluacion = { ...ev, name_Employee: emp.name_Employee, lastName_Employee: emp.lastName_Employee };
                this.radarData = this.getRadarData(this.evaluacion);
                this.loading = false;
              },
              error: () => {
                this.radarData = this.getRadarData(ev);
                this.loading = false;
              }
            });
          } else {
            this.radarData = this.getRadarData(ev);
            this.loading = false;
          }
        } else {
          this.evaluacion = null;
          this.loading = false;
        }
      },
      error: () => {
        this.evaluacion = null;
        this.loading = false;
      }
    });
  }

  getRadarData(ev: Evaluacion) {
    return [
      { arg: 'Productividad', valor: Number(ev.productivity) || 0 },
      { arg: 'Puntualidad', valor: Number(ev.punctuality) || 0 },
      { arg: 'Calidad del Trabajo', valor: Number(ev.work_quality) || 0 },
      { arg: 'Buena comunicación', valor: Number(ev.communication) || 0 },
      { arg: 'Disposición a Aprender', valor: Number(ev.willingness_to_learn) || 0 },
      { arg: 'Honestidad', valor: Number(ev.honesty) || 0 },
      { arg: 'Iniciativa', valor: Number(ev.initiative) || 0 },
      { arg: 'Integración con el equipo', valor: Number(ev.teamwork) || 0 }
    ];
  }

  onSave() {
    // Implementar guardado en modo edición
  }
} 