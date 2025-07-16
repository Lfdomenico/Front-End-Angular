import {
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ClienteService } from '../services/cliente.service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  console.log('AuthInterceptor: Iniciando para URL:', request.url);

  const clienteService = inject(ClienteService);
  const router = inject(Router);
  //const authToken = clienteService.getJwtToken();
  const authToken = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiQ0xJRU5URSIsImZ1bGxOYW1lIjoiZ2FicmllbCIsImVtYWlsIjoiYmFjaGVnYUBlbWFpbC5jb20iLCJzdWIiOiI5ZDJlNmExYS1lYzFhLTQ3NzQtOWExMS1mNWRhYWRjMDA5ZTAiLCJpYXQiOjE3NTI1OTI1OTAsImV4cCI6MTc1MjY3ODk5MH0.mHnhfqL5b5ZPYMqCa96_3b7W2Qa7WfhHTX4huO_5Arw';

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

      // Modificado para incluir status 0 na condição de redirecionamento
      if (error.status === 401 || error.status === 403 || error.status === 0) {
        // Você pode adicionar uma condição extra aqui se quiser diferenciar o status 0
        // Por exemplo, se (error.status === 0 && error.url === null) para um erro de rede genérico
        // Mas para seu caso, a intenção é redirecionar quando não há token e a requisição falha.

        console.log('AuthInterceptor: Status 0/401/403 detectado! Iniciando logout e redirecionamento.');

        clienteService.logout(); // Limpa os tokens e o estado de login
        router.navigate(['/login']); // Redireciona para a página de login
        
        // Mensagem mais específica dependendo do status (opcional, mas melhor para UX)
        if (error.status === 0) {
            alert('Erro de conexão ou sessão inválida. Por favor, faça login novamente.');
        } else {
            alert('Sua sessão expirou ou você não tem permissão. Por favor, faça login novamente.');
        }
      } else {
        console.log('AuthInterceptor: Erro capturado, mas não é 0, 401 nem 403. Status:', error.status);
      }
      // Re-lança o erro para que o componente que fez a requisição original possa lidar com ele também
      return throwError(() => error);
    })
  );
};