import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

enum Competencia {
  Productividad = 'Productividad',
  Puntualidad = 'Puntualidad',
  Calidad = 'Calidad del Trabajo',
  Comunicacion = 'Buena comunicación',
  Aprender = 'Disposición a aprender',
  Honestidad = 'Honestidad',
  Iniciativa = 'Iniciativa',
  Equipo = 'Integración con el equipo'
}

type ClaveComp = keyof typeof Competencia;

@Component({
  selector: 'app-resultados-page',
  imports: [FormsModule],
  templateUrl: './resultados-page.component.html',
  styleUrl: './resultados-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultadosPageComponent {

  // Modelo
  codigoEmpleado = '';
  nombreEmpleado = '';
  comentarios = '';

  // Valores tipados
  valores: Record<ClaveComp, number> = {
    Productividad: 0,
    Puntualidad: 0,
    Calidad: 0,
    Comunicacion: 0,
    Aprender: 0,
    Honestidad: 0,
    Iniciativa: 0,
    Equipo: 0
  };

  // Generamos dinámicamente el listado de competencias
  competencias = Object.entries(Competencia) as [ClaveComp, string][];

  onSubmit() {
    const resultado = {
      codigo: this.codigoEmpleado,
      nombre: this.nombreEmpleado,
      valores: { ...this.valores },
      comentarios: this.comentarios
    };
    console.log('Enviando evaluación:', resultado);
    // TODO: llamar a servicio HTTP aquí
  }

  onCancel() {
    this.codigoEmpleado = '';
    this.nombreEmpleado = '';
    this.comentarios = '';
    for (const key of Object.keys(this.valores) as ClaveComp[]) {
      this.valores[key] = 0;
    }
  }

}
