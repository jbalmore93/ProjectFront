import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  
 
  if (req.url.startsWith('http')) {
    return next(req);
  }

  // Si es relativa, le agrega la baseUrl del environment
  const apiReq = req.clone({
    url: `${environment.apiUrl}${req.url}`
  });

  return next(apiReq);
};