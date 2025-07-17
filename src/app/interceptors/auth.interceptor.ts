import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '../pages/login/login.component';
import { LoginService } from '../services/login.service';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  console.log('AuthInterceptor: Iniciando para URL:', request.url);

  const loginSer = inject(LoginService);
  const router = inject(Router);
  const authToken = loginSer.getJwtToken();

  if (authToken) {
    console.log('AuthInterceptor: Token JWT encontrado, adicionando cabeçalho Authorization.');
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
  } else {
    console.log('AuthInterceptor: Nenhum token JWT encontrado.');
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('AuthInterceptor: Erro capturado no catchError. Status:', error.status, 'Erro completo:', error);

      if (error.status === 401 || error.status === 403 || error.status === 0) {


        loginSer.logout(); // Limpa os tokens e o estado de login
        router.navigate(['/login']); // Redireciona para a página de login
        
        if (error.status === 0) {
            // alert('Erro de conexão ou sessão inválida. Por favor, faça login novamente.');
        } else {
            // alert('Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.');
        }
      } 
      return throwError(() => error);
    })
  );
};