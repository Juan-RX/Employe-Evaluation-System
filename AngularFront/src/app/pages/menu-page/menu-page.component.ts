import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { SidebarComponent } from '../../components/sidebar/sidebar.component';



@Component({
  selector: 'app-menu-page',
  imports: [],
  templateUrl: './menu-page.component.html',
  styleUrl: './menu-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuPageComponent {
    isdebarExpanded = false;

    onToggle() {
        this.isdebarExpanded = !this.isdebarExpanded;
    }
 }
