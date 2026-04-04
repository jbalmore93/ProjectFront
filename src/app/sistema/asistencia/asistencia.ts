import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Servicio } from '../../servicios/servicio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-asistencia',
  imports: [CommonModule, FormsModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
})
export class Asistencia implements OnInit {

  asistencias: any[] = [];
  cargando = true;
  error = '';

  asistenciaCheckout: any = null;
  personaRecoge: string = '';
  errorCheckout = '';

  idNinoCheckin: number | null = null;
  errorCheckin = '';

  asistenciaSeleccionada: any = null;

  constructor(
    private servicio: Servicio,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    try {
      this.asistencias = await this.servicio.obtenerAsistencias();
    } catch (err) {
      this.error = 'Error al cargar las asistencias.';
    } finally {
      this.cargando = false;
    }
  }

  async verDetalle(asistencia: any) {
    this.asistenciaSeleccionada = asistencia;

    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modalEl = document.getElementById('modalAsistencia')!;
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  async abrirModalCheckin() {
    this.idNinoCheckin = null;
    this.errorCheckin = '';

    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modalEl = document.getElementById('modalCheckin')!;
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  async abrirModalCheckout(asistencia: any) {
    this.asistenciaCheckout = asistencia;
    this.personaRecoge = '';
    this.errorCheckout = '';

    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modalEl = document.getElementById('modalCheckout')!;
      const modal = new Modal(modalEl);
      modal.show();
    }
  }

  async registrarCheckout() {
    try {
      if (!this.asistenciaCheckout) {
        this.errorCheckout = 'No hay asistencia seleccionada';
        return;
      }

      await this.servicio.checkout(
        this.asistenciaCheckout.IdAsistencia,
        this.personaRecoge
      );

      this.personaRecoge = '';
      this.asistenciaCheckout = null; // ✅ era '' (string), debe ser null

      // Cerrar modal
      if (isPlatformBrowser(this.platformId)) {
        const { Modal } = await import('bootstrap');
        const modalEl = document.getElementById('modalCheckout')!;
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
      }

      // Refrescar tabla
      this.asistencias = await this.servicio.obtenerAsistencias();

    } catch (err: any) {
      if (err.status === 404) {
        this.errorCheckout = 'Asistencia no encontrada o ya cerrada';
      } else if (err.status === 400) {
        this.errorCheckout = 'Datos inválidos';
      } else {
        this.errorCheckout = 'Error al registrar salida';
      }
    }
  }

  async registrarCheckin() {
    try {
      if (!this.idNinoCheckin) {
        this.errorCheckin = 'Debe ingresar un ID válido';
        return;
      }

      await this.servicio.checkin(this.idNinoCheckin);

      // Cerrar modal
      if (isPlatformBrowser(this.platformId)) {
        const { Modal } = await import('bootstrap');
        const modalEl = document.getElementById('modalCheckin')!;
        const modal = Modal.getInstance(modalEl);
        modal?.hide();
      }

      // Refrescar tabla
      this.asistencias = await this.servicio.obtenerAsistencias();

    } catch (err: any) {
      if (err.status === 400) {
        this.errorCheckin = 'ID inválido';
      } else if (err.status === 401) {
        this.errorCheckin = 'No autorizado';
      } else {
        this.errorCheckin = 'Error al registrar entrada';
      }
    }
  }
}