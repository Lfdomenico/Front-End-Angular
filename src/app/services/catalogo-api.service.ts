import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Interface que representa a estrutura de um serviço/setor retornado pelo backend do Catalogo-Service.
 *
 * É MUITO IMPORTANTE que os nomes das propriedades (id, nome, descricao, tempoMedioMinutos, etc.)
 * correspondam EXATAMENTE aos nomes das propriedades do JSON que o seu backend (Catalogo-Service) retorna.
 *
 * Se o seu DTO de serviço no Spring Boot tiver um campo 'tempoMedioMinutos',
 * então aqui deve ser 'tempoMedioMinutos' também.
 */
export interface ServicoBackend {
  id: string; // Exemplo: um UUID retornado como string
  nome: string;
  descricao: string;
  tempoMedioMinutos: number;
  documentosObrigatoriosIds: string[];
  icon: string; // Se o backend retornar isso
  // Adicione outros campos se o seu DTO do backend tiver (ex: 'ativo', 'categoria', 'icone', etc.)
}

@Injectable({
  providedIn: 'root'
})
export class CatalogoApiService {
  // Esta é a URL do seu Gateway API.
  // O Gateway DEVE estar configurado para rotear chamadas de '/api/setor/**' para o seu Catalogo-Service.
  private apiUrl = 'http://localhost:9000/api/setor'; 

  constructor(private http: HttpClient) { }

  /**
   * Método para buscar a lista completa de serviços disponíveis no backend.
   *
   * Ele faz uma requisição GET para a URL definida (através do seu Gateway).
   * @returns Um Observable que emitirá um array de objetos ServicoBackend.
   */
  getTodosOsServicos(): Observable<ServicoBackend[]> {
    return this.http.get<ServicoBackend[]>(this.apiUrl); // GET para http://localhost:9000/api/setor
  }
}