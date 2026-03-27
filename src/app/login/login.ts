import { Component, OnInit, OnDestroy, Inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Servicio } from '../servicios/servicio';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit, OnDestroy {

  usuario: string = '';
  pass: string = '';
  cargando: boolean = false;
  error: string = '';

  bloqueado: boolean = false;
  tiempoRestante: number = 0;
  countdownInterval: any = null;

  constructor(
    private router: Router,
    private servicio: Servicio,
    private ngZone: NgZone,              // ← único cambio en el constructor
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit() {
    this.doc.body.style.backgroundColor = '#1a1a2e';
  }

  ngOnDestroy() {
    this.doc.body.style.backgroundColor = '';
    this.limpiarInterval();
  }

  get tiempoFormateado(): string {
    const min = Math.floor(this.tiempoRestante / 60);
    const seg = this.tiempoRestante % 60;
    return `${min}:${seg.toString().padStart(2, '0')}`;
  }

  private limpiarInterval() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  private iniciarBloqueo(minutos: number = 15) {
    this.bloqueado = true;
    this.tiempoRestante = minutos * 60;
    this.limpiarInterval();

    this.ngZone.runOutsideAngular(() => {          // ← cambio aquí
      this.countdownInterval = setInterval(() => {
        this.ngZone.run(() => {                    // ← y aquí
          this.tiempoRestante--;
          if (this.tiempoRestante <= 0) {
            this.bloqueado = false;
            this.error = '';
            this.limpiarInterval();
          }
        });
      }, 1000);
    });
  }

  async login(form: any) {
    if (!form.valid || this.bloqueado) return;

    this.cargando = true;
    this.error = '';

    const result = await this.servicio.login(this.usuario, this.pass);

    if (!result.success) {
      this.error = result.error ?? 'Error desconocido';
      if (result.status === 423) {
        this.iniciarBloqueo(15);
      }
    }

    this.cargando = false;
  }
}
