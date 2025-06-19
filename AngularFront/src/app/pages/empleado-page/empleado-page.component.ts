import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SidebarComponent } from "../../components/sidebar/sidebar.component";
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-empleado-page',
  templateUrl: './empleado-page.component.html',
  styleUrl: './empleado-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpleadoPageComponent { }
