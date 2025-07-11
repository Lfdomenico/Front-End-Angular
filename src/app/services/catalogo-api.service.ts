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

@Injectable({
  providedIn: 'root'
})
export class CatalogoApiService {
  private apiUrl = 'http://localhost:9000/api/setor'; 

  constructor(private http: HttpClient) { }

  getTodosOsServicos(): Observable<ServicoBackend[]> {
    return this.http.get<ServicoBackend[]>(this.apiUrl); 
  }
}