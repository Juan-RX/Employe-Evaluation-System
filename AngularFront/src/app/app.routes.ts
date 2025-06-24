import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { EmpleadoPageComponent } from './pages/empleado-page/empleado-page.component';
import { EvaluacionComponent } from './pages/evaluacion/evaluacion.component';
import { PuestoPageComponent } from './pages/puesto-page/puesto-page.component';
import { ResultadosPageComponent } from './pages/resultados-page/resultados-page.component';
import { AuthGuard } from './Services/AuthGuard';
import { GraphicPageComponent } from './pages/graphic-page/graphic-page.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginPageComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'home',
    component: MenuPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'empleado',
    component: EmpleadoPageComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'puesto',
    component: PuestoPageComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'evaluacion',
    component: EvaluacionComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'resultados',
    component: ResultadosPageComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'graphic-page/:id',
    component: GraphicPageComponent,
    canActivate: [AuthGuard]
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
