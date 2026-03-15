import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Servicio } from '../../servicios/servicio';

@Component({
  selector: 'app-bitacora',
  imports: [CommonModule, FormsModule],
  templateUrl: './bitacora.html',
  styleUrl: './bitacora.css',
})
export class Bitacora implements OnInit {

  cargando = true;
  guardando = false;
  error = '';
  mensaje = '';

  bitacora: any = {
    idNino: '',
    comida: false,
    siestaMinutos: 0,
    observaciones: '',
    estadoAnimo: ''
  };

  constructor(
    private servicio: Servicio,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.cargando = false;
  }

  async guardar() {

    this.guardando = true;
    this.error = '';
    this.mensaje = '';

    try {

      await this.servicio.crearBitacora(this.bitacora);

      this.mensaje = "Bitácora registrada correctamente";

      this.bitacora = {
        idNino: '',
        comida: false,
        siestaMinutos: 0,
        observaciones: '',
        estadoAnimo: ''
      };

    } catch (err) {

      this.error = "Error al registrar la bitácora";
      console.log(err)

    } finally {

      this.guardando = false;

    }

  }

}