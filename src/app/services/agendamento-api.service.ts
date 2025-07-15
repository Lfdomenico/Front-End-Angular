import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoApiService {
  private apiUrl = 'http://localhost:9000/api/agendamentos'; 

  constructor(private http: HttpClient) { }

  getHorariosDisponiveis(data: string, servicoId: string): Observable<string[]> {
    const params = new HttpParams()
      .set('data', data)
      .set('servicoId', servicoId); 

    return this.http.get<string[]>(`${this.apiUrl}/disponibilidade`, { params });
  }

  salvarAgendamento(agendamentoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, agendamentoData);
  }

  getAgendamentosPorData(data: string): Observable<AgendamentoCompleto[]> {
    // O backend precisará de um endpoint como GET /api/agendamentos/data?data=YYYY-MM-DD
    // ou se você for usar o listarTodos e filtrar no front, essa chamada seria apenas this.http.get<AgendamentoCompleto[]>(this.apiUrl);
    // Mas para eficiência, é melhor que o backend filtre.
    const params = new HttpParams().set('data', data);
    return this.http.get<AgendamentoCompleto[]>(`${this.apiUrl}/data`, { params });
  }

  // NOVO MÉTODO: Deleta um agendamento pelo ID
  /**
   * Deleta um agendamento pelo seu ID.
   * @param id O ID do agendamento a ser deletado.
   * @returns Um Observable vazio (ou com a resposta de sucesso).
   */
  deletarAgendamento(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para atualizar um agendamento (PUT ou PATCH) - Opcional para agora, mas útil para o botão "Alterar"
  updateAgendamento(id: string, agendamentoData: any): Observable<AgendamentoCompleto> {
    return this.http.put<AgendamentoCompleto>(`${this.apiUrl}/${id}`, agendamentoData);
  }
}

export interface AgendamentoCompleto {
  id: string;
  usuarioId: string;
  nomeClienteSnapshot: string;
  atendenteId: string;
  servicoId: string;
  nomeServicoSnapshot: string;
  dataHora: string; // Formato ISO 8601 (ex: "2025-07-09T10:00:00")
  atendidoEm: string | null; // Pode ser nulo
  observacoes: string | null; // Pode ser nulo
  criadoEm: string;
  status: string; // Ou um enum se você tiver um para status no frontend
  documentosPendentes: DocumentoPendente[]; // Adapte esta interface também se necessário
}

export interface DocumentoPendente {
  id: string;
  documentoCatalogoId: string;
  nomeDocumentoSnapshot: string;
  status: string; 
  observacao: string | null;
  urlDocumento: string | null;
}