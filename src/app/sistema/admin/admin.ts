import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Servicio } from '../../servicios/servicio';
import { FormsModule } from "@angular/forms";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin implements OnInit {

  usuarios: any[] = [];
  cargando = true;
  error = '';

  
  email = '';
  password = '';
  rol = '';

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

  async agregar() {
    const { Modal } = await import('bootstrap');
    const modalEl = document.getElementById('modalUsuario')!;
    const modal = new Modal(modalEl);
    modal.show();
  }

async guardarUsuario() {

  if (!this.email || !this.password || !this.rol) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos incompletos',
      text: 'Todos los campos son obligatorios'
    });
    return;
  }

  if (this.password.length < 6) {
    Swal.fire({
      icon: 'warning',
      title: 'Contraseña inválida',
      text: 'Debe tener al menos 6 caracteres'
    });
    return;
  }

  try {
    await this.servicio.crearUsuario({
      email: this.email,
      password: this.password,
      idRole: Number(this.rol)
    });

    this.usuarios = await this.servicio.obtenerUsuarios();

    Swal.fire({
      icon: 'success',
      title: 'Usuario creado',
      text: 'El usuario fue registrado correctamente',
      timer: 2000,
      showConfirmButton: false
    });

    this.email = '';
    this.password = '';
    this.rol = '';

  
    const { Modal } = await import('bootstrap');
    const modalEl = document.getElementById('modalUsuario')!;
    const modal = Modal.getInstance(modalEl);
    modal?.hide();

  } catch (err: any) {

    let mensaje = 'Error al crear usuario';

    if (err?.error?.msg) {
      mensaje = err.error.msg; 
    }

    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: mensaje
    });
  }
}
}