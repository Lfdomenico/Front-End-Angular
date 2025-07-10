import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor, DatePipe, TitleCasePipe } from '@angular/common'; // Incluir pipes necessários
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentoUploadApiService, UploadStatus } from '../../services/documento-upload-api.service';
import { Agendamento, DocumentoPendente, TipoDocumentoCatalogo } from '../../models/agendamento.model'; // Assumindo que TipoDocumentoCatalogo está aqui
import { Triagem } from '../../models/triagem.model'; // Assumindo que Triagem está aqui

@Component({
  selector: 'app-documento-upload-page',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, DatePipe, TitleCasePipe], // Assegurar que os pipes estão nos imports
  templateUrl: './documento-upload-page.component.html',
  styleUrls: ['./documento-upload-page.component.scss']
})
export class DocumentoUploadPageComponent implements OnInit {

  selectedFile: File | null = null;
  agendamentoId: string | null = null;
  triagemId: string | null = null;
  documentoCatalogoId: string | null = null; // O tipo de documento selecionado no dropdown para upload

  agendamentoDetails: Agendamento | null = null;
  triagemDetails: Triagem | null = null;
  documentosNecessarios: DocumentoPendente[] = []; // Documentos pendentes para o agendamento/triagem selecionado

  agendamentosDisponiveis: Agendamento[] = []; // Lista de agendamentos para o dropdown em modo geral
  triagensDisponiveis: Triagem[] = [];
  tiposDocumentoDisponiveisParaUpload: TipoDocumentoCatalogo[] = []; // Tipos de documento para o dropdown de upload (filtrados)
  todosOsTiposDeDocumentoDoCatalogo: TipoDocumentoCatalogo[] = []; // Todos os tipos ativos do catálogo (sem filtro de pendência)

  uploadProgress: number = 0;
  uploadMessage: string = '';
  isUploading: boolean = false;
  uploadError: string = '';

  currentUserId: string = 'AD6AB5B0-D306-4F53-AEF5-E966971E89D9'; // ID de usuário para testes ou simulações

  constructor(
    private uploadService: DocumentoUploadApiService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // console.log('[ngOnInit] Componente inicializado.');

    // 1. Carregar todos os tipos de documento do catálogo primeiro (assíncrono)
    this.loadTiposDocumento();

    // 2. Assinar os queryParams para detectar o modo de acesso (geral ou contextual)
    this.route.queryParams.subscribe(params => {
      this.agendamentoId = params['agendamentoId'] || null;
      this.triagemId = params['triagemId'] || null;

      // console.log(`[ngOnInit - queryParams] agendamentoId: ${this.agendamentoId}, triagemId: ${this.triagemId}`);

      if (this.agendamentoId) {
        this.loadAgendamentoDetails(this.agendamentoId);
      } else if (this.triagemId) {
        this.loadTriagemDetails(this.triagemId);
      } else {
        // Modo "Geral": Sem ID na URL. Carrega a lista de agendamentos para seleção manual.
        this.loadAgendamentosDoUsuario();
        this.loadTriagensDoUsuario();
        this.documentosNecessarios = []; // Assegura que a lista de pendentes esteja vazia inicialmente
        this.uploadError = 'Por favor, selecione um agendamento ou triagem para fazer o upload de documentos.';
        // O `filterAvailableDocumentTypes()` será chamado dentro de `loadTiposDocumento()` para o modo geral.
      }
    });
  }

  /**
   * Carrega a lista de agendamentos para o dropdown de seleção manual.
   * Só é chamado se a página não for carregada com um agendamentoId/triagemId na URL.
   */
  loadAgendamentosDoUsuario(): void {
    if (!this.agendamentoId && !this.triagemId) { // Só executa se estiver em modo geral
      // console.log('[loadAgendamentosDoUsuario] Carregando agendamentos para o usuário:', this.currentUserId);
      this.uploadService.getAgendamentosDoUsuario(this.currentUserId).subscribe({
        next: (data: Agendamento[]) => {
          this.agendamentosDisponiveis = data;
          // console.log('[loadAgendamentosDoUsuario] Agendamentos disponíveis:', this.agendamentosDisponiveis);
          if (data.length === 0) {
            this.uploadError = 'Não há agendamentos disponíveis para este usuário.';
          } else {
            this.uploadError = 'Selecione um agendamento da lista abaixo.';
          }
        },
        error: (err: any) => {
          console.error('Erro ao carregar agendamentos do usuário:', err);
          this.uploadError = 'Erro ao carregar agendamentos. Verifique o backend e a rede.';
        }
      });
    }
  }

  loadTriagensDoUsuario(): void {
    if (!this.agendamentoId && !this.triagemId) {
      // console.log('[loadTriagensDoUsuario] Carregando triagens em aberto para o usuário:', this.currentUserId);
      this.uploadService.getTriagensEmAbertoDoUsuario(this.currentUserId).subscribe({
        next: (data: Triagem[]) => {
          this.triagensDisponiveis = data;
          // console.log('[loadTriagensDoUsuario] Triagens disponíveis:', this.triagensDisponiveis);
        },
        error: (err: any) => {
          console.error('Erro ao carregar triagens do usuário:', err);
          // this.uploadError = 'Erro ao carregar triagens. Verifique o backend e a rede.';
        }
      });
    }
  }

  /**
   * Carrega os detalhes de um agendamento específico.
   * @param id O ID do agendamento.
   */
  loadAgendamentoDetails(id: string): void {
    // console.log(`[loadAgendamentoDetails] Carregando detalhes para agendamento ID: ${id}`);
    this.uploadService.getAgendamentoDetails(id).subscribe({
      next: (data: Agendamento) => {
        this.agendamentoDetails = data;
        this.documentosNecessarios = data.documentosPendentes || []; // Garante array vazio se for null/undefined
        // console.log('[loadAgendamentoDetails] Detalhes do agendamento carregados:', this.agendamentoDetails);
        // console.log('[loadAgendamentoDetails] Documentos Necessários:', this.documentosNecessarios);
        this.filterAvailableDocumentTypes(); // Re-filtra os tipos de documento para upload com base nestes detalhes
        this.uploadError = '';
      },
      error: (err: any) => {
        console.error('Erro ao carregar detalhes do agendamento:', err);
        this.agendamentoDetails = null;
        this.documentosNecessarios = [];
        this.uploadError = 'Erro ao carregar detalhes do agendamento. Pode não existir ou o servidor está fora.';
        this.filterAvailableDocumentTypes(); // Garante que o dropdown de tipos de documento seja redefinido
      }
    });
  }

  /**
   * Carrega os detalhes de uma triagem específica.
   * @param id O ID da triagem.
   */
  loadTriagemDetails(id: string): void {
    // console.log(`[loadTriagemDetails] Carregando detalhes para triagem ID: ${id}`);
    this.uploadService.getTriagemDetails(id).subscribe({
      next: (data: Triagem) => {
        this.triagemDetails = data;
        this.documentosNecessarios = data.documentosPendentes || []; // Garante array vazio
        // console.log('[loadTriagemDetails] Detalhes da triagem carregados:', this.triagemDetails);
        // console.log('[loadTriagemDetails] Documentos Necessários:', this.documentosNecessarios);
        this.filterAvailableDocumentTypes(); // Re-filtra os tipos de documento para upload
        this.uploadError = '';
      },
      error: (err: any) => {
        console.error('Erro ao carregar detalhes da triagem:', err);
        this.triagemDetails = null;
        this.documentosNecessarios = [];
        this.uploadError = 'Erro ao carregar detalhes da triagem. Pode não existir ou o servidor está fora.';
        this.filterAvailableDocumentTypes(); // Redefine o dropdown
      }
    });
  }

  /**
   * Carrega todos os tipos de documento do catálogo do backend.
   * Chamado uma única vez no ngOnInit.
   */
  loadTiposDocumento(): void {
    // console.log('[loadTiposDocumento] Iniciando carregamento de todos os tipos de documento do catálogo.');
    this.uploadService.getTiposDocumento().subscribe({
      next: (data: TipoDocumentoCatalogo[]) => {
        this.todosOsTiposDeDocumentoDoCatalogo = data.filter(tipo => tipo.isAtivo);
        // console.log('[loadTiposDocumento] Tipos de Documento do Catálogo Carregados (Ativos):', this.todosOsTiposDeDocumentoDoCatalogo);

        // Após carregar o catálogo, se a página estiver no modo geral (sem IDs na URL),
        // Chame o filtro para popular o dropdown de upload com todos os tipos ativos.
        if (!this.agendamentoId && !this.triagemId) {
          // console.log('[loadTiposDocumento] Acionando filterAvailableDocumentTypes() para o modo geral (sem ID na URL).');
          this.filterAvailableDocumentTypes();
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar tipos de documento do catálogo:', err);
        this.uploadError = 'Erro ao carregar tipos de documento. Verifique o backend e a rede.';
        this.tiposDocumentoDisponiveisParaUpload = []; // Garante que o dropdown fica vazio em caso de erro
      }
    });
  }

  /**
   * Filtra os tipos de documento que devem aparecer no dropdown de upload,
   * com base no contexto (agendamento/triagem selecionado ou modo geral).
   */
  filterAvailableDocumentTypes(): void {


    // Se a lista base de tipos do catálogo ainda não foi carregada, não podemos filtrar.
    if (!this.todosOsTiposDeDocumentoDoCatalogo || this.todosOsTiposDeDocumentoDoCatalogo.length === 0) {
      this.tiposDocumentoDisponiveisParaUpload = [];
      console.warn('[filterAvailableDocumentTypes] Catálogo de tipos de documento ainda não carregado ou vazio. Dropdown de tipos de upload ficará vazio.');
      return; // <--- Se o catálogo está vazio, ele sai aqui
    }

    // Cenário 1: Modo "Geral" (Nenhum agendamento/triagem selecionado explicitamente)
    if (!this.agendamentoDetails && !this.triagemDetails) {
      this.tiposDocumentoDisponiveisParaUpload = [...this.todosOsTiposDeDocumentoDoCatalogo];
      // console.log('[filterAvailableDocumentTypes] Modo Geral: Exibindo todos os tipos de documento ativos no dropdown:', this.tiposDocumentoDisponiveisParaUpload);
      return;
    }

    // Cenário 2: Modo "Contextual" (Agendamento ou Triagem selecionados)
    // Se há documentos pendentes para este contexto
    if (this.documentosNecessarios && this.documentosNecessarios.length > 0) {
      const tiposPendentesIds = new Set(
        this.documentosNecessarios
          .filter(doc => doc.status !== 'APROVADO') // <--- FILTRO CRÍTICO AQUI
          .map(doc => doc.documentoCatalogoId)
      );
      // console.log(' - IDs de documentos pendentes identificados:', tiposPendentesIds); // Novo log

      this.tiposDocumentoDisponiveisParaUpload = this.todosOsTiposDeDocumentoDoCatalogo.filter(
        catalogoTipo => catalogoTipo.isAtivo && tiposPendentesIds.has(catalogoTipo.id)
      );
      // console.log('[filterAvailableDocumentTypes] Modo Contextual: Tipos de documento filtrados (Pendentes e Ativos) para o dropdown:', this.tiposDocumentoDisponiveisParaUpload);

    } else {
      // Cenário 2.1: Modo "Contextual", mas sem documentos pendentes (ou todos já foram enviados/aprovados)
      this.tiposDocumentoDisponiveisParaUpload = []; // Nenhuma opção para upload de pendências
      // console.log('[filterAvailableDocumentTypes] Modo Contextual: Nenhum documento pendente para upload. Dropdown de tipos de upload vazio.');
    }
  }
  /**
   * Manipulador para a mudança de seleção no dropdown de Agendamentos.
   * @param agendamentoId O ID do agendamento selecionado.
   */
  onAgendamentoSelected(agendamentoId: string): void {
    console.log('[onAgendamentoSelected] Agendamento selecionado:', agendamentoId);
    this.triagemId = null; // Garante que a seleção de triagem seja desmarcada
    this.agendamentoId = agendamentoId;

    if (agendamentoId) {
      this.loadAgendamentoDetails(agendamentoId);
    } else {
      this.agendamentoDetails = null;
      this.documentosNecessarios = [];
      this.filterAvailableDocumentTypes();
      this.uploadError = 'Por favor, selecione um agendamento ou triagem para fazer o upload de documentos.';
    }
  }

  // NOVO MÉTODO: Lógica de seleção de triagem (mantém agendamentoId null)
  onTriagemSelectedDropdown(triagemId: string): void { // Renomeado para evitar conflito com onTriagemSelected (input)
    console.log('[onTriagemSelectedDropdown] Triagem selecionada (dropdown):', triagemId);
    this.agendamentoId = null; // Garante que a seleção de agendamento seja desmarcada
    this.triagemId = triagemId;

    if (triagemId) {
      this.loadTriagemDetails(triagemId);
    } else {
      this.triagemDetails = null;
      this.documentosNecessarios = [];
      this.filterAvailableDocumentTypes();
      this.uploadError = 'Por favor, selecione um agendamento ou triagem para fazer o upload de documentos.';
    }
  }

  /**
   * Manipulador para a entrada de texto no campo de ID da Triagem.
   * @param triagemId O ID da triagem digitado.
   */
  onTriagemSelected(triagemId: string): void {
    // console.log('[onTriagemSelected] Triagem selecionada/digitada:', triagemId);
    this.agendamentoId = null; // Garante que apenas um ID de contexto esteja ativo
    this.triagemId = triagemId;

    if (triagemId) {
      this.loadTriagemDetails(triagemId);
    } else {
      // Se o campo de triagem foi limpo
      this.triagemDetails = null;
      this.documentosNecessarios = [];
      this.filterAvailableDocumentTypes(); // Retorna ao modo geral de seleção de tipos
      this.uploadError = 'Por favor, selecione um agendamento ou triagem para fazer o upload de documentos.';
    }
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadMessage = '';
    this.uploadError = '';
    // console.log('[onFileSelected] Arquivo selecionado:', this.selectedFile?.name);
  }

  onUpload(): void {
    // console.log('[onUpload] Iniciando processo de upload.');
    this.uploadMessage = '';
    this.uploadError = '';
    this.uploadProgress = 0;

    if (!this.selectedFile) {
      this.uploadError = 'Por favor, selecione um arquivo para upload.';
      console.warn('[onUpload] Falha: Nenhum arquivo selecionado.');
      return;
    }
    if (!this.documentoCatalogoId) {
      this.uploadError = 'Por favor, selecione o tipo de documento.';
      console.warn('[onUpload] Falha: Tipo de documento não selecionado.');
      return;
    }
    if (!this.agendamentoId && !this.triagemId) {
      this.uploadError = 'Selecione um agendamento ou triagem para fazer o upload.';
      console.warn('[onUpload] Falha: Nenhum agendamento ou triagem associado.');
      return;
    }
    if (this.agendamentoId && this.triagemId) {
        this.uploadError = 'O documento não pode estar associado a um ID de Triagem E a um ID de Agendamento simultaneamente.';
        console.warn('[onUpload] Falha: Agendamento e Triagem IDs preenchidos simultaneamente.');
        return;
    }

    this.isUploading = true;
    // console.log('[onUpload] Chamando uploadService.uploadDocumento...');
    this.uploadService.uploadDocumento(
      this.triagemId,
      this.agendamentoId,
      this.documentoCatalogoId,
      this.selectedFile
    ).subscribe({
      next: (event: UploadStatus) => {
        if (event.status === 'progress') {
          this.uploadProgress = event.message as number;
          this.uploadMessage = `Enviando: ${event.message}%`;
          // // console.log(`[Upload Progress] ${event.message}%`); // Log mais detalhado
        } else if (event.status === 'success') {
          this.uploadMessage = 'Upload realizado com sucesso!';
          this.uploadError = '';
          this.isUploading = false;
          this.resetForm();
          // console.log('[onUpload] Upload bem-sucedido. Recarregando detalhes...');
          // Após upload com sucesso, recarregar os detalhes para atualizar o status do documento
          if (this.agendamentoId) {
            this.loadAgendamentoDetails(this.agendamentoId);
          } else if (this.triagemId) {
            this.loadTriagemDetails(this.triagemId);
          }
        }
      },
      error: (error: any) => {
        console.error('Erro no upload:', error);
        this.uploadError = `Erro ao fazer upload: ${error.message || 'Verifique o console para mais detalhes.'}`;
        this.uploadMessage = '';
        this.isUploading = false;
      }
    });
  }

  resetForm(): void {
    // console.log('[resetForm] Resetando formulário.');
    this.selectedFile = null;
    this.documentoCatalogoId = null;
    this.uploadProgress = 0;
    this.uploadMessage = '';
    this.uploadError = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
        fileInput.value = ''; // Limpa o input de arquivo visualmente
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'APROVADO': return 'status-aprovado';
      case 'REJEITADO': return 'status-rejeitado';
      case 'AGUARDANDO_VALIDACAO': return 'status-aguardando';
      case 'PENDENTE': return 'status-pendente';
      case 'ENVIADO': return 'status-enviado';
      default: return '';
    }
  }
}