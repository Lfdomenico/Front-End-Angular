// Em: src/app/services/cliente.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface que representa o corpo da requisição que o back-end espera
// (baseado no seu formulário e no ClienteRequest do back-end)
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
   // --- NOVO MÉTODO DE LOGIN ---
  // Note que o retorno é um Observable<string>, pois seu backend retorna apenas texto
  login(credenciais: LoginRequest): Observable<string> {
    return this.http.post(`${this.apiUrl}/login`, credenciais, { responseType: 'text' });
  }
}
