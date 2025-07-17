import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; 

export interface LoginResponse{
  nome: string;
  email: string;
  accessToken: string;
}


export interface LoginRequest {
    email: string;
    senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly authUrl = 'http://localhost:9000/api/auth';
  
  constructor(private http: HttpClient) { }

  login(credenciais: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.authUrl}/login`, credenciais)
      .pipe(
        tap(response => {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('userName', response.nome);
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('jwtToken', response.accessToken);
        })
      );
  }
  
  getJwtToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('isLoggedIn') === 'true';
  }

  getId(): string | null {
    return localStorage.getItem('userId');
  }
  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('jwtToken');
  }
  
}