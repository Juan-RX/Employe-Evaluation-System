import { Routes } from '@angular/router';
import { Component } from '@angular/core';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { MenuPageComponent } from './pages/menu-page/menu-page.component';
import { EmpleadoPageComponent } from './pages/empleado-page/empleado-page.component';
import { EvaluacionComponent } from './pages/evaluacion/evaluacion.component';
import { PuestoPageComponent } from './pages/puesto-page/puesto-page.component';
import { ResultadosPageComponent } from './pages/resultados-page/resultados-page.component';

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
  },
  {
    path: 'empleado',
    component: EmpleadoPageComponent,

  },

  {
    path: 'puesto',
    component: PuestoPageComponent,
  },

  {
    path: 'evaluacion',
    component: EvaluacionComponent,
  },

  {
    path: 'resultados',
    component: ResultadosPageComponent,
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];
