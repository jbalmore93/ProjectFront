import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Servicio } from '../../servicios/servicio';

@Component({
  selector: 'app-asistencia',
  imports: [CommonModule],
  templateUrl: './asistencia.html',
  styleUrl: './asistencia.css',
})
export class Asistencia implements OnInit {

  asistencias: any[] = [];
  cargando = true;
  error = '';

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
}
