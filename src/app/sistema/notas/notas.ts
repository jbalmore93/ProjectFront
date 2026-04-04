import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
declare var bootstrap: any;
 
// ──────────────────────────────────────────────
// INTERFACES
// ──────────────────────────────────────────────
export interface Nota {
  id: string;
  nombre: string;
  periodo: string;
  fecha: string;
  maestra: string;
  observaciones: string;
  nucleos: { [key: string]: string };
}
 
export interface NucleoConfig {
  id: string;
  label: string;
  ambito: string;
}
 
export interface AmbitoConfig {
  key: string;
  label: string;
  labelCorto: string;
  icon: string;
}
 
// ──────────────────────────────────────────────
// COMPONENT
// ──────────────────────────────────────────────
@Component({
  selector: 'app-notas',
  imports: [CommonModule, FormsModule],
  templateUrl: './notas.html',
})
export class NotasComponent implements OnInit {
 
  // ── Datos ──
  notas: Nota[] = [];
  notasFiltradas: Nota[] = [];
 
  // ── Seleccionados ──
  notaSeleccionada: Nota | null = null;
  notaAEliminar: Nota | null = null;
  editandoId: string | null = null;
 
  // ── Filtros ──
  filtroNino = '';
  filtroAmbito = '';
  filtroPeriodo = '';
 
  // ── Form ──
  form = this.formVacio();
  errorForm = '';
 
  // ──────────────────────────────────────────────
  // CATÁLOGO DE ÁMBITOS Y NÚCLEOS (basado en el PDF)
  // ──────────────────────────────────────────────
  readonly AMBITOS: AmbitoConfig[] = [
    { key: 'social',   label: 'Relaciones Sociales y Afectivas',      labelCorto: 'Social',   icon: '🤝' },
    { key: 'explora',  label: 'Exploración y Experimentación',         labelCorto: 'Explora',  icon: '🔬' },
    { key: 'estetica', label: 'Estéticas y Creativas',                 labelCorto: 'Estética', icon: '🎨' },
    { key: 'lenguaje', label: 'Lenguaje, Comunicación y Expresión',    labelCorto: 'Lenguaje', icon: '💬' },
    { key: 'cuerpo',   label: 'Cuerpo, Movimiento y Bienestar Físico', labelCorto: 'Cuerpo',   icon: '🏃' },
  ];
 
  readonly NUCLEOS: NucleoConfig[] = [
    // Social
    { id: 'identidad',      label: 'Identidad y Autonomía',                    ambito: 'social'   },
    { id: 'socioemocional', label: 'Habilidades Socioemocionales',              ambito: 'social'   },
    { id: 'convivencia',    label: 'Convivencia',                               ambito: 'social'   },
    // Exploración
    { id: 'cientifico',     label: 'Pensamiento Científico',                    ambito: 'explora'  },
    { id: 'tecnologico',    label: 'Pensamiento Tecnológico y Computacional',   ambito: 'explora'  },
    { id: 'logico',         label: 'Pensamiento Lógico-Matemático',             ambito: 'explora'  },
    // Estética
    { id: 'musical',        label: 'Expresión Musical',                         ambito: 'estetica' },
    { id: 'plastica',       label: 'Expresión Plástica y Visual',               ambito: 'estetica' },
    { id: 'dramatica',      label: 'Expresión Dramática',                       ambito: 'estetica' },
    // Lenguaje
    { id: 'oral',           label: 'Lenguaje Oral',                             ambito: 'lenguaje' },
    { id: 'noverbal',       label: 'Lenguaje No Verbal',                        ambito: 'lenguaje' },
    { id: 'lectura',        label: 'Lectura y Escritura',                       ambito: 'lenguaje' },
    // Cuerpo
    { id: 'imagen',         label: 'Cuerpo, Imagen y Percepción',               ambito: 'cuerpo'   },
    { id: 'movimiento',     label: 'Movimiento y Expresión Corporal',           ambito: 'cuerpo'   },
    { id: 'bienestar',      label: 'Bienestar Físico',                          ambito: 'cuerpo'   },
  ];
 
  constructor(public auth: AuthService) {}
 
  ngOnInit(): void {
    this.aplicarFiltros();
  }
 
  // ──────────────────────────────────────────────
  // HELPERS DE CATÁLOGO
  // ──────────────────────────────────────────────
 
  nucleosDeAmbito(ambitoKey: string): NucleoConfig[] {
    return this.NUCLEOS.filter(n => n.ambito === ambitoKey);
  }
 
  nucleosPorAmbito(ambitoKey: string): string[] {
    return this.NUCLEOS.filter(n => n.ambito === ambitoKey).map(n => n.id);
  }
 
  labelNucleo(id: string): string {
    return this.NUCLEOS.find(n => n.id === id)?.label ?? id;
  }
 
  ambitosVisibles(): AmbitoConfig[] {
    return this.filtroAmbito
      ? this.AMBITOS.filter(a => a.key === this.filtroAmbito)
      : this.AMBITOS;
  }
 
  // ──────────────────────────────────────────────
  // FILTROS Y STATS
  // ──────────────────────────────────────────────
 
  aplicarFiltros(): void {
    const q = this.filtroNino.toLowerCase();
    this.notasFiltradas = this.notas.filter(n => {
      const matchNino    = !q || n.nombre.toLowerCase().includes(q);
      const matchPeriodo = !this.filtroPeriodo || n.periodo === this.filtroPeriodo;
      return matchNino && matchPeriodo;
    });
  }
 
  notasCompletas(): number {
    return this.notas.filter(n =>
      this.NUCLEOS.every(nu => !!n.nucleos[nu.id])
    ).length;
  }
 
  // ──────────────────────────────────────────────
  // BADGE DE NOTA
  // ──────────────────────────────────────────────
 
  badgeNota(val: string): { [klass: string]: boolean } {
    return {
      'bg-success':              val === 'A',
      'bg-primary':              val === 'B',
      'bg-warning text-dark':    val === 'C',
      'bg-danger':               val === 'D',
      'bg-light text-secondary': !val,
    };
  }
 
  // ──────────────────────────────────────────────
  // FORM
  // ──────────────────────────────────────────────
 
  private formVacio() {
    const nucleos: { [key: string]: string } = {};
    // Se inicializan vacíos; los ids reales se asignan cuando NUCLEOS está listo
    return { nombre: '', periodo: '', fecha: '', maestra: '', observaciones: '', nucleos };
  }
 
  private resetForm(): void {
    const nucleos: { [key: string]: string } = {};
    this.NUCLEOS.forEach(n => nucleos[n.id] = '');
    this.form = { nombre: '', periodo: '', fecha: new Date().toISOString().split('T')[0], maestra: '', observaciones: '', nucleos };
    this.errorForm = '';
  }
 
  private uid(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }
 
  // ──────────────────────────────────────────────
  // MODAL NUEVA
  // ──────────────────────────────────────────────
 
  abrirModalNueva(): void {
    this.editandoId = null;
    this.resetForm();
    this.abrirModal('modalNota');
  }
 
  // ──────────────────────────────────────────────
  // GUARDAR (crear o editar)
  // ──────────────────────────────────────────────
 
  guardarNota(): void {
    if (!this.form.nombre.trim() || !this.form.periodo) {
      this.errorForm = 'El nombre y el período son obligatorios.';
      return;
    }
    this.errorForm = '';
 
    if (this.editandoId) {
      const idx = this.notas.findIndex(n => n.id === this.editandoId);
      if (idx !== -1) {
        this.notas[idx] = { ...this.notas[idx], ...this.form };
      }
    } else {
      this.notas.push({ id: this.uid(), ...this.form });
    }
 
    this.editandoId = null;
    this.aplicarFiltros();
    this.cerrarModal('modalNota');
  }
 
  // ──────────────────────────────────────────────
  // EDITAR
  // ──────────────────────────────────────────────
 
  editarNota(nota: Nota): void {
    this.editandoId = nota.id;
    const nucleos: { [key: string]: string } = {};
    this.NUCLEOS.forEach(n => nucleos[n.id] = nota.nucleos[n.id] ?? '');
    this.form = {
      nombre: nota.nombre,
      periodo: nota.periodo,
      fecha: nota.fecha,
      maestra: nota.maestra,
      observaciones: nota.observaciones,
      nucleos,
    };
    this.errorForm = '';
    this.abrirModal('modalNota');
  }
 
  // ──────────────────────────────────────────────
  // VER DETALLE
  // ──────────────────────────────────────────────
 
  verDetalle(nota: Nota): void {
    this.notaSeleccionada = nota;
    this.abrirModal('modalDetalle');
  }
 
  // ──────────────────────────────────────────────
  // ELIMINAR
  // ──────────────────────────────────────────────
 
  pedirEliminar(nota: Nota): void {
    this.notaAEliminar = nota;
    this.abrirModal('modalEliminar');
  }
 
  eliminarNota(): void {
    if (!this.notaAEliminar) return;
    this.notas = this.notas.filter(n => n.id !== this.notaAEliminar!.id);
    this.notaAEliminar = null;
    this.aplicarFiltros();
    this.cerrarModal('modalEliminar');
  }
 
  // ──────────────────────────────────────────────
  // UTILS MODAL (Bootstrap)
  // ──────────────────────────────────────────────
 
  private abrirModal(id: string): void {
    const el = document.getElementById(id);
    if (el) bootstrap.Modal.getOrCreateInstance(el).show();
  }
 
  private cerrarModal(id: string): void {
    const el = document.getElementById(id);
    if (el) bootstrap.Modal.getInstance(el)?.hide();
  }
}