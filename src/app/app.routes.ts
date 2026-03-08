import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './sistema/dashboard/dashboard';
import { Layout } from './Layout/layout/layout';
import { Admin } from './sistema/admin/admin';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'sistema',        // ← CAMBIA de '' a 'sistema'
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'admin/usuarios', component: Admin },
    ]
  },

  { path: '**', redirectTo: 'login' }
];