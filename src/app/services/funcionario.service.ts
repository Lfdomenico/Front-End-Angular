// Em src/app/services/funcionario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest } from './cliente.service'; // reutilizar a mesma interface

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {
  
  private apiUrl = 'http://localhost:9000/api/funcionario'; 

  constructor(private http: HttpClient) { }

  login(credenciais: LoginRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciais, { responseType: 'text' });
  }
}