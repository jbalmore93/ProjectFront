import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');

  let request = req;

  // agregar base URL si la ruta es relativa
  if (!req.url.startsWith('http')) {
    request = req.clone({
      url: `${environment.apiUrl}${req.url}`
    });
  }

  // agregar token si existe
  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // enviar cookies siempre
  request = request.clone({
    withCredentials: true
  });

  return next(request);
};