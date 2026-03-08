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
      await firstValueFrom(
        this.http.post('auth/login', { email, password }, { withCredentials: true })
      );

      await firstValueFrom(
        this.http.get('me', { withCredentials: true })
      );

      this.router.navigate(['/sistema/dashboard']);
      return { success: true };

    } catch (err: any) {
      if (err.status === 423) {
        return { success: false, error: 'Cuenta bloqueada por intentos fallidos. Intenta en 15 minutos.' };
      } else if (err.status === 401) {
        return { success: false, error: 'Correo o contraseña incorrectos.' };
      } else {
        return { success: false, error: 'Error de conexión. Intente de nuevo.' };
      }
    }
  }
}
