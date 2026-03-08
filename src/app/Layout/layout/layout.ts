import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import axios from 'axios';

const API = 'http://localhost:3000';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  user: any = null;

  constructor(private router: Router) {}

  async ngOnInit() {
    try {
      const { data } = await axios.get(`${API}/me`, { withCredentials: true });
      this.user = data;
    } catch (err: any) {
      console.error('❌ /me falló:', err.response?.status, err.response?.data);
      // Solo redirige si es 401, no en otros errores
      if (err.response?.status === 401) {
        this.router.navigate(['/login']);
      }
    }
  }

  async logout() {
    await axios.post(`${API}/auth/logout`, {}, { withCredentials: true });
    this.user = null;
    this.router.navigate(['/login']);
  }

  get isAdmin() { return this.user?.roleName === 'Admin'; }
  get isMaestro() { return this.user?.roleName === 'Maestro'; }
  get isPadre() { return this.user?.roleName === 'Padre'; }
}