import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { APP_CONFIG } from '../app.config'; 

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
  private apiUrl = APP_CONFIG.apiUrl+'/setor'; 
  private triagemUrl = APP_CONFIG.apiUrl+'/triagens'; 

  constructor(private http: HttpClient) { }

  getTodosOsServicos(): Observable<ServicoBackend[]> {
    return this.http.get<ServicoBackend[]>(this.apiUrl); 
  }
  getHorarioDisponivel(): Observable<TriagemResponse> {
    return this.http.get<TriagemResponse>(`${this.triagemUrl}/disponibilidade`); 
  }
}