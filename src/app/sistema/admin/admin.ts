import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../servicios/servicio'; // ajusta la ruta si es necesario

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

  constructor(private servicio: Servicio) {}

  async ngOnInit() {
    try {
      this.usuarios = await this.servicio.obtenerUsuarios();
    } catch (err) {
      this.error = 'Error al cargar usuarios.';
    } finally {
      this.cargando = false;
    }
  }
}