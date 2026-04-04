import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../../servicios/servicio';

@Component({
  selector: 'app-ninos',
  imports: [CommonModule, FormsModule],
  templateUrl: './ninos.html',
  styleUrl: './ninos.css',
})
export class Ninos implements OnInit {

  ninos: any[] = [];
  cargando = true;
  error = '';

  // Formulario compartido para crear y editar
  form = {
    idTutor: null as number | null,
    nombre: '',
    apellido: '',
    fechaNacimiento: '',
    alergias: '',
    grupo: ''
  };
  errorForm = '';
  modoEdicion = false;
  ninoEditandoId: number | null = null;

  // Detalle
  ninoSeleccionado: any = null;

  // Confirmación eliminar
  ninoAEliminar: any = null;

  constructor(
    private servicio: Servicio,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  async ngOnInit() {
    await this.cargarNinos();
  }

  async cargarNinos() {
    this.cargando = true;
    this.error = '';
    try {
      this.ninos = await this.servicio.listarNinos();
    } catch (err) {
      this.error = 'Error al cargar los niños.';
    } finally {
      this.cargando = false;
    }
  }

  private resetForm() {
    this.form = { idTutor: null, nombre: '', apellido: '', fechaNacimiento: '', alergias: '', grupo: '' };
    this.errorForm = '';
    this.modoEdicion = false;
    this.ninoEditandoId = null;
  }

  private async abrirModal(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modal = new Modal(document.getElementById(id)!);
      modal.show();
    }
  }

  private async cerrarModal(id: string) {
    if (isPlatformBrowser(this.platformId)) {
      const { Modal } = await import('bootstrap');
      const modalEl = document.getElementById(id)!;
      Modal.getInstance(modalEl)?.hide();
    }
  }

  async abrirModalCrear() {
    this.resetForm();
    await this.abrirModal('modalNino');
  }

  async abrirModalEditar(nino: any) {
    this.modoEdicion = true;
    this.ninoEditandoId = nino.IdNino;
    this.errorForm = '';
    this.form = {
      idTutor:          nino.IdTutor,
      nombre:           nino.Nombre,
      apellido:         nino.Apellido,
      fechaNacimiento:  nino.FechaNacimiento?.substring(0, 10),
      alergias:         nino.Alergias || '',
      grupo:            nino.Grupo
    };
    await this.abrirModal('modalNino');
  }

  async verDetalle(nino: any) {
    this.ninoSeleccionado = nino;
    await this.abrirModal('modalDetalle');
  }

  async confirmarEliminar(nino: any) {
    this.ninoAEliminar = nino;
    await this.abrirModal('modalEliminar');
  }

  async guardarNino() {
    this.errorForm = '';

    if (!this.form.idTutor || !this.form.nombre || !this.form.apellido ||
        !this.form.fechaNacimiento || !this.form.grupo) {
      this.errorForm = 'Todos los campos marcados con * son requeridos.';
      return;
    }

    const payload = {
      idTutor:          this.form.idTutor,
      nombre:           this.form.nombre,
      apellido:         this.form.apellido,
      fechaNacimiento:  this.form.fechaNacimiento,
      alergias:         this.form.alergias || undefined,
      grupo:            this.form.grupo
    };

    try {
      if (this.modoEdicion && this.ninoEditandoId) {
        await this.servicio.actualizarNino(this.ninoEditandoId, payload);
      } else {
        await this.servicio.registrarNino(payload);
      }

      await this.cerrarModal('modalNino');
      await this.cargarNinos();
      this.resetForm();

    } catch (err: any) {
      if (err.status === 404) {
        this.errorForm = 'Tutor no encontrado.';
      } else if (err.status === 400) {
        this.errorForm = 'Datos inválidos, revisa los campos.';
      } else {
        this.errorForm = 'Error al guardar. Intenta de nuevo.';
      }
    }
  }

  async eliminarNino() {
    if (!this.ninoAEliminar) return;
    try {
      await this.servicio.eliminarNino(this.ninoAEliminar.IdNino);
      await this.cerrarModal('modalEliminar');
      await this.cargarNinos();
      this.ninoAEliminar = null;
    } catch (err: any) {
      await this.cerrarModal('modalEliminar');
      this.error = 'Error al eliminar el niño.';
    }
  }
}
