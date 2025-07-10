// Em: src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // 1. IMPORTE O 'tap' DO RXJS

export interface LoginResponse{
  nome: string;
  email: string
}

// Interface que representa o corpo da requisição que o back-end espera
export interface ClienteRequest {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  agencia: string;
  conta: string;
  senha?: string;
}

// Interface que representa a resposta do back-end
export interface ClienteResponse {
  id: number;
  nome: string;
  // adicione outros campos se o back-end retornar mais dados
}

// --- NOVA Interface para a requisição de LOGIN ---
export interface LoginRequest {
    email: string;
    senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  // A URL DEVE apontar para o API GATEWAY!
  private readonly apiUrl = 'http://localhost:9000/api/cliente';

  constructor(private http: HttpClient) { }

  cadastrar(cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, cliente);
  }

  // --- MÉTODO DE LOGIN CORRIGIDO ---
  login(credenciais: LoginRequest): Observable<LoginResponse> {
    // Note que removemos o `{ responseType: 'text' }` e esperamos um LoginResponse
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credenciais)
      .pipe(
        tap(response => {
          // Agora salvamos o nome e o e-mail recebidos da API
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', response.nome);
          localStorage.setItem('userEmail', response.email);
        })
      );
  }

  // Adicione um método de logout para ser um bom cidadão digital :)
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    // Aqui você pode também redirecionar o usuário para a tela de login.
  }
}