import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Dashboard } from './sistema/dashboard/dashboard';
import { Layout } from './Layout/layout/layout';
import { Admin } from './sistema/admin/admin';
import { MisNinos } from './sistema/mis-ninos/mis-ninos';
import { Asistencia } from './sistema/asistencia/asistencia';
import { Bitacora } from './sistema/bitacora/bitacora';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: 'sistema',        
    component: Layout,
    children: [
      { path: 'dashboard', component: Dashboard },
      { path: 'admin/usuarios', component: Admin },
      {path:'mis-ninos',component: MisNinos},
      {path: 'asistencia',component: Asistencia},
      {path:'bitacora',component: Bitacora}
    ]
  },

  { path: '**', redirectTo: 'login' }
];