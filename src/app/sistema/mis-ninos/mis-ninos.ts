import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { Servicio } from '../../servicios/servicio';

@Component({
  selector: 'app-mis-ninos',
  imports: [CommonModule],
  templateUrl: './mis-ninos.html',
  styleUrl: './mis-ninos.css',
})
export class MisNinos implements OnInit {

  tutor: any = null;
  ninos: any[] = [];
  cargando = true;
  error = '';

  ninoSeleccionado: any = null;
  bitacora: any[] = [];
  cargandoBitacora = false;

  constructor(
    private servicio: Servicio,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    try {
      const { tutor, ninos } = await this.servicio.obtenerNinos();
      this.tutor = tutor;
      this.ninos = ninos;
    } catch (err) {
      this.error = 'Error al cargar los datos.';
    } finally {
      this.cargando = false;
    }
  }

  async verBitacora(nino: any) {
    this.ninoSeleccionado = nino;
    this.bitacora = [];
    this.cargandoBitacora = true;

    // Solo ejecuta en el navegador, no en el servidor
    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modalEl = document.getElementById('modalBitacora')!;
      const modal = new Modal(modalEl);
      modal.show();
    }

    try {
      this.bitacora = await this.servicio.obtenerBitacora(nino.IdNino);
    } catch (e) {
      this.bitacora = [];
    } finally {
      this.cargandoBitacora = false;
    }
  }
}