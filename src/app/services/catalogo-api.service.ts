import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ServicoBackend {
  id: string; 
  nome: string;
  descricao: string;
  tempoMedioMinutos: number;
  documentosObrigatoriosIds: string[];
  icon: string; 
}
export interface TriagemResponse {
  disponibilidade: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoApiService {
  private apiUrl = 'http://localhost:9000/api/setor'; 
  private triagemUrl = 'http://localhost:9000/api/triagens'; 

  constructor(private http: HttpClient) { }

  getTodosOsServicos(): Observable<ServicoBackend[]> {
    return this.http.get<ServicoBackend[]>(this.apiUrl); 
  }
  getHorarioDisponivel(): Observable<TriagemResponse> {
    return this.http.get<TriagemResponse>(`${this.triagemUrl}/disponibilidade`); 
  }

  getServicoById(id: string): Observable<ServicoBackend> {
    // Este endpoint precisa existir no CatalogoService do backend
    return this.http.get<ServicoBackend>(`${this.apiUrl}/${id}`);
  }
}