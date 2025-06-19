import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HeaderComponent } from "./components/header/header.component";
import { filter } from 'rxjs';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarComponent, HeaderComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {



  pageTitle = '';
  showLayout = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.showLayout = !url.includes('/login'); // Oculta si estás en /login
        this.setTitleByRoute(url);
      });
  }


  private setTitleByRoute(url: string) {
    if (url.includes('/empleado')) {
      this.pageTitle = 'Gestión | Empleados';
    } else if (url.includes('/puesto')) {
      this.pageTitle = 'Gestión | Puestos';
    } else if (url.includes('/evaluacion')) {
      this.pageTitle = 'Gestión | Evaluaciones';
    } else if (url.includes('/resultados')) {
      this.pageTitle = 'Gestión | Resultados';
    } else {
      this.pageTitle = 'Bienvenido';
    }
  }
}
