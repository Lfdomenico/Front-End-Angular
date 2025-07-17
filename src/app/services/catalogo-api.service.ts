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
export interface SetorRequest {
  nome: string; // Alterado de nomeSetor para nome
  descricao: string; // Alterado de descricaoSetor para descricao
  isAtivo: boolean;
  prioridade: number;
  tempoMedioMinutos: number | null; // Pode ser null, então adicione | null
  documentosObrigatoriosIds: string[]; // <<-- NOVO CAMPO ADICIONADO
  icone: string; // Alterado de selectedSectorIcon para icone
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
  cadastrarSetor(dto: SetorRequest): Observable<SetorRequest> {
    return this.http.post<SetorRequest>(this.apiUrl, dto)
  }
}