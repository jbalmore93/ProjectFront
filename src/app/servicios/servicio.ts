import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Servicio {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res: any = await firstValueFrom(
        this.http.post('auth/login', { email, password }, { withCredentials: true })
      );

      if (res?.token) {
        localStorage.setItem('token', res.token);
      }

      await firstValueFrom(
        this.http.get('me', { withCredentials: true })
      );

      this.router.navigate(['/sistema/dashboard']);
      return { success: true };

    } catch (err: any) {
      if (err.status === 423) {
        return { success: false, error: 'Cuenta bloqueada por intentos fallidos. Intenta en 15 minutos.' };
      }
      if (err.status === 401) {
        return { success: false, error: 'Correo o contraseña incorrectos.' };
      }
      return { success: false, error: 'Error de conexión. Intente de nuevo.' };
    }
  }

  async obtenerUsuarios(): Promise<any[]> {
    try {
      const data = await firstValueFrom(
        this.http.get<any[]>('admin/usuarios', { withCredentials: true })
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerNinos(): Promise<{ tutor: any; ninos: any[] }> {
    try {
      const data = await firstValueFrom(
        this.http.get<{ tutor: any; ninos: any[] }>('padre/ninos', { withCredentials: true })
      );
      return data;
    } catch (error) {
      throw error;
    }
  }

  async obtenerBitacora(idNino: number): Promise<any[]> {
  try {
    const data = await firstValueFrom(
      this.http.get<any[]>(`padre/ninos/${idNino}/bitacora`, { withCredentials: true })
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async obtenerAsistencias(): Promise<any[]> {
  try {
    const data = await firstValueFrom(
      this.http.get<any[]>('asistencia', { withCredentials: true })
    );
    return data;
  } catch (error) {
    throw error;
  }
}

async crearBitacora(data: any) {

  const res = await firstValueFrom(
    this.http.post('/bitacora', data)
  );

  return res;

}

}