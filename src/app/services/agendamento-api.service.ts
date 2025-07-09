import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http'; // Importe HttpParams
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoApiService {
  private apiUrl = 'http://localhost:9000/api/agendamentos'; // URL do seu Gateway para agendamentos

  constructor(private http: HttpClient) { }

  /**
   * Busca os horários disponíveis para uma dada data e um serviço específico.
   * @param data A data para buscar horários, no formato 'YYYY-MM-DD'.
   * @param servicoId O ID do serviço para o qual a disponibilidade está sendo verificada.
   * @returns Um Observable contendo uma lista de strings de data/hora disponíveis.
   */
  getHorariosDisponiveis(data: string, servicoId: string): Observable<string[]> {
    // Constrói os parâmetros de query para a requisição GET
    const params = new HttpParams()
      .set('data', data)
      .set('servicoId', servicoId); // Adiciona o servicoId aos parâmetros da URL

    // Faz a requisição GET para o endpoint de disponibilidade
    return this.http.get<string[]>(`${this.apiUrl}/disponibilidade`, { params });
  }

  /**
   * Salva um novo agendamento no backend.
   * @param agendamentoData Um objeto contendo os dados do agendamento (usuarioId, servicoId, atendenteId, dataHora).
   * @returns Um Observable contendo a resposta do backend após o agendamento.
   */
  salvarAgendamento(agendamentoData: any): Observable<any> {
    // Faz a requisição POST para o endpoint de agendamentos
    return this.http.post<any>(this.apiUrl, agendamentoData);
  }
}
