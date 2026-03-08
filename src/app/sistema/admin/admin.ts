import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import axios from 'axios';

const API = 'http://localhost:3000';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {
  usuarios: any[] = [];
  cargando = true;
  error = '';

  async ngOnInit() {
    try {
      const { data } = await axios.get(`${API}/admin/usuarios`, { withCredentials: true });
      this.usuarios = data;
    } catch (err: any) {
      this.error = 'Error al cargar usuarios.';
    } finally {
      this.cargando = false;
    }
  }
}