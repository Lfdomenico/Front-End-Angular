import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';

export interface TriagemResponse {
  disponibilidade: Date;
}

export interface Triagem {
  id: string;
  clienteId: string;
  servicoId: string;
  horarioSolicitacao: string;
  horarioEstimadoAtendimento?: string;
  status: string;
  tempoEstimadoMinutos?: number;
  prioridade?: number;
  nomeClienteSnapshot: string;
  nomeServicoSnapshot: string;
}

@Injectable({
  providedIn: 'root'
})
export class TriagemApiService {

  
  private triagemUrl = 'http://localhost:9000/api/triagens'; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<Triagem[]> {
    return this.http.get<Triagem[]>(this.triagemUrl);
  }

  getHorarioDisponivel(): Observable<TriagemResponse> {
      return this.http.get<TriagemResponse>(`${this.triagemUrl}/disponibilidade`); 
    }

  salvarTriagem(triagemData: any): Observable<any> {
    return this.http.post<any>(this.triagemUrl, triagemData);
  }
}