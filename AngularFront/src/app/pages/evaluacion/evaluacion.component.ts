import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from "../../components/sidebar/sidebar.component";

@Component({
  selector: 'app-evaluacion',
  imports: [],
  templateUrl: './evaluacion.component.html',
  styleUrl: './evaluacion.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EvaluacionComponent { }
