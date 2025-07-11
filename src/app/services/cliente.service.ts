import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 

export interface LoginResponse{
  nome: string;
  email: string;
  accessToken1: string;
}

export interface ClienteRequest {
  nome: string;
  cpf: string;
  telefone: string;
  email: string;
  agencia: string;
  conta: string;
  senha?: string;
}

export interface ClienteResponse {
  id: number;
  nome: string;
}

export interface LoginRequest {
    email: string;
    senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private readonly apiUrl = 'http://localhost:9000/api/cliente';
  private readonly authUrl = 'http://localhost:9000/api/auth';
  
  constructor(private http: HttpClient) { }

  cadastrar(cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, cliente);
  }

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, credenciais)
      .pipe(
        tap(response => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', response.nome);
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('jwtToken', response.accessToken1);
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('jwtToken');
  }

  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }
}