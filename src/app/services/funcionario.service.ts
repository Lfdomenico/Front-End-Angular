// src/app/services/funcionario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { APP_CONFIG } from '../app.config';

// 1. Interface de request (mesmos campos exigidos pelo back)
export interface FuncionarioRequest {
  nome: string;
  cpf: string;
  email: string;
  senha: string;
}

// 2. Interface de response de cadastro
export interface FuncionarioResponse {
  // ajuste conforme o que seu back retorna (se tiver id, etc)
  nome: string;
  cpf: string;
  email: string;
  senha: string;
}

// 3. Interface de response de login
export interface LoginResponse{
  nome: string;
  email: string;
  accessToken: string;
}

// 4. Mantém a mesma interface de LoginRequest do cliente
export interface LoginRequest {
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  // a mesma baseUrl do ClienteService, mas apontando para /funcionario
  private readonly apiUrl  = APP_CONFIG.apiUrl+'/funcionario';

  constructor(private http: HttpClient) {}

  /**
   * Cadastra um novo funcionário.
   * POST http://localhost:9000/api/funcionario
   */
  cadastrar(dto: FuncionarioRequest): Observable<FuncionarioResponse> {
    return this.http.post<FuncionarioResponse>(this.apiUrl, dto);
  }

  /**
   * Faz login de funcionário. Espera receber:
   * { nome: string, email: string, accessToken: string }
   * e dispara o armazenamento em localStorage.
   */
  // login(credenciais: LoginRequest): Observable<string> {
  //   return this.http.post(
  //     `${this.authUrl}/login`,
  //     credenciais,
  //     { responseType: 'text' }   // indica que a resposta vem como texto puro
  //   );
  // }

  // login(credenciais: LoginRequest): Observable<LoginResponse> {
  //     return this.http.post<LoginResponse>(`${this.authUrl}/login`, credenciais)
  //       .pipe(
  //         tap(response => {
  //           localStorage.setItem('isLoggedIn', 'true');
  //           localStorage.setItem('userName', response.nome);
  //           localStorage.setItem('userEmail', response.email);
  //           localStorage.setItem('jwtToken', response.accessToken);
  //         })
  //       );
  //   }

}
