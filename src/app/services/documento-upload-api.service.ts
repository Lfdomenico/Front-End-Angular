import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpParams, HttpProgressEvent } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs'; // Importe 'of' e 'throwError'
import { map, delay } from 'rxjs/operators'; // Importe 'delay' para simular latência
import { Agendamento, DocumentoPendente, TipoDocumentoCatalogo  } from '../models/agendamento.model'; // Importe os modelos
import {  Triagem } from '../models/triagem.model'; // Importe os modelos
// import { MOCK_AGENDAMENTOS, MOCK_TRIAGENS, MOCK_DOCUMENTOS_CATALOGO } from '../mock-data/mock-agendamentos'; // Importe os dados fictícios

export interface UploadStatus {
  status: 'progress' | 'success' | 'idle';
  message: number | any;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentoUploadApiService {
  private documentoServiceBaseUrl = 'http://localhost:9000/api/documentacao'; // Seu serviço de documentos
  private agendamentoServiceBaseUrl = 'http://localhost:9000/api/agendamentos'; // Seu serviço de agendamentos
  private triagemServiceBaseUrl = 'http://localhost:9000/api/triagens'; // Seu serviço de triagem (exemplo)
  private catalogoServiceBaseUrl = 'http://localhost:9000/api/documentos'; // Seu serviço de catálogo (exemplo)


  constructor(private http: HttpClient) { }

  // SIMULANDO O UPLOAD (SEM MUDANÇAS AQUI PARA O ERRO DE event.total)
  uploadDocumento(
    triagemId: string | null,
    agendamentoId: string | null,
    documentoCatalogoId: string,
    file: File
  ): Observable<UploadStatus> {
    const formData: FormData = new FormData();
    formData.append('arquivo', file);

    let params = new HttpParams();

    if (triagemId) {
      params = params.append('triagemId', triagemId);
    } else if (agendamentoId) {
      params = params.append('agendamentoId', agendamentoId);
    } else {
      return throwError(() => new Error("Um ID de triagem ou agendamento deve ser fornecido para o upload.")) as Observable<UploadStatus>;
    }

    params = params.append('documentoCatalogoId', documentoCatalogoId);

    const uploadUrl = `${this.documentoServiceBaseUrl}/upload`;

    return this.http.post(uploadUrl, formData, {
      params: params,
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.UploadProgress:
            if (event.total !== undefined) {
                const progress = Math.round((100 * event.loaded) / event.total);
                return { status: 'progress', message: progress } as UploadStatus;
            }
            return { status: 'idle', message: '' } as UploadStatus;

          case HttpEventType.Response:
            return { status: 'success', message: event.body } as UploadStatus;

          default:
            return { status: 'idle', message: '' } as UploadStatus;
        }
      })
    );
  }

  // --- NOVOS MÉTODOS PARA OBTER DETALHES DE AGENDAMENTO/TRIAGEM E DOCUMENTOS ---

  getAgendamentosDoUsuario(clienteId: string): Observable<Agendamento[]> {
    const url = `${this.agendamentoServiceBaseUrl}/cliente/${clienteId}`;
    // console.log(`[DocumentoUploadApiService] Buscando agendamentos reais em: ${url}`);
    return this.http.get<Agendamento[]>(url);
  }

  // Ajustando: Buscar detalhes de UM agendamento específico
  // Se o seu backend tem um endpoint como /api/agendamentos/{id}
  getAgendamentoDetails(agendamentoId: string): Observable<Agendamento> {
    const url = `${this.agendamentoServiceBaseUrl}/${agendamentoId}`;
    // console.log(`[DocumentoUploadApiService] Buscando detalhes do agendamento real em: ${url}`);
    return this.http.get<Agendamento>(url);
  }

  // Ajustando: Buscar detalhes de UMA triagem específica
  // Se o seu backend tem um endpoint como /api/triagens/{id}
  getTriagemDetails(triagemId: string): Observable<Triagem> {
    const url = `${this.triagemServiceBaseUrl}/${triagemId}`; // Ajuste a URL se for diferente
    // console.log(`[DocumentoUploadApiService] Buscando detalhes da triagem real em: ${url}`);
    return this.http.get<Triagem>(url);
  }

  // Ajustando: Buscar tipos de documento do catálogo
  // Se o seu backend tem um endpoint para isso, ex: /api/catalogo/documentos/tipos
  getTiposDocumento(): Observable<TipoDocumentoCatalogo[]> {
    const url = `${this.catalogoServiceBaseUrl}`; // CONFIRME ESTA URL
    // console.log(`[DocumentoUploadApiService] Buscando tipos de documento reais em: ${url}`);
    return this.http.get<TipoDocumentoCatalogo[]>(url);
  }

  getTriagensEmAbertoDoUsuario(clienteId: string): Observable<Triagem[]> {
    // Sua rota atual que retorna um único objeto:
    const url = `${this.triagemServiceBaseUrl}/cliente/${clienteId}`;
    console.log(`[DocumentoUploadApiService] Buscando triagem ÚNICA para cliente em: ${url}`);
    return this.http.get<Triagem>(url).pipe( // Aqui ele espera um único Triagem
      map(triagem => {
        // Se a triagem existe e tem um status que consideramos "aberto" para o dropdown
        if (triagem && (triagem.status === 'AGUARDANDO' || triagem.status === 'EM_ATENDIMENTO')) {
          return [triagem]; // Transforma o único objeto em um array de um elemento
        }
        return []; // Retorna um array vazio se não houver triagem ou o status não for "aberto"
      }),
      // catchError(err => {
      //   // Se a API retornar 404 (Not Found) ou similar para indicar que não há triagem
      //   if (err.status === 404) {
      //     console.warn(`[DocumentoUploadApiService] Triagem para o cliente ${clienteId} não encontrada ou não em status aberto.`);
      //     return of([]); // Retorna um Observable de um array vazio, sem erro
      //   }
      //   // Para outros erros, propaga o erro
      //   console.error(`[DocumentoUploadApiService] Erro ao buscar triagem do cliente ${clienteId}:`, err);
      //   return throwError(() => new Error(`Erro ao buscar triagem do cliente: ${err.message || err.statusText}`));
      // })
    );
  }
}