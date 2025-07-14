import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface para definir a estrutura da Tarefa que virá do backend
export interface Tarefa {
  id: string; // O UUID virá como string
  nome: string;
  descricao: string;
}

@Injectable({
  providedIn: 'root'
})
export class TarefaService {
  // O caminho passa pelo Gateway, que redireciona para o tarefa-service
  private apiUrl = 'http://localhost:9000/api/tarefa'; 

  constructor(private http: HttpClient) { }

  // Método que busca a lista de todas as tarefas
  getTarefas(): Observable<Tarefa[]> {
    return this.http.get<Tarefa[]>(this.apiUrl);
  }
}