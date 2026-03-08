import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
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

  constructor(
    private router: Router,
    private servicio: Servicio,            
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit() {
    this.doc.body.style.backgroundColor = '#1a1a2e';
  }

  ngOnDestroy() {
    this.doc.body.style.backgroundColor = '';
  }

  async login(form: any) {
    if (!form.valid) return;

    this.cargando = true;
    this.error = '';

    const result = await this.servicio.login(this.usuario, this.pass);  

    if (!result.success) {
      this.error = result.error ?? 'Error desconocido';
    }

    this.cargando = false;
  }
}