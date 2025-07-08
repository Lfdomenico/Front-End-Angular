import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AgendamentoApiService {
  private baseUrl = 'http://localhost:8082/api/agendamentos';

  constructor(private http: HttpClient) { }

  getHorariosDisponiveis(data: string): Observable<string[]> {
    const params = new HttpParams().set('data', data);
    return this.http.get<string[]>(`${this.baseUrl}/disponibilidade`, { params });
  }
}