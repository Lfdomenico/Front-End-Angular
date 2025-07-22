import { Component, OnInit, OnDestroy } from '@angular/core'; // Adicione OnDestroy
import { CommonModule, NgIf, NgFor, DatePipe, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DocumentoUploadApiService, UploadStatus } from '../../services/documento.service';
import { Agendamento, DocumentoPendente, TipoDocumentoCatalogo } from '../../models/agendamento.model';
import { Triagem } from '../../models/triagem.model';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { of, forkJoin } from 'rxjs'; // Importe forkJoin e of
import { catchError, map } from 'rxjs/operators'; // Importe map

@Component({
  selector: 'app-documento-upload-page',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, TitleCasePipe, NavbarComponent],
  templateUrl: './documento-upload-page.component.html',
  styleUrls: ['./documento-upload-page.component.scss']
})
export class DocumentoUploadPageComponent implements OnInit, OnDestroy { // Implemente OnDestroy

  selectedFile: File | null = null;
  agendamentoId: string | null = null;
  triagemId: string | null = null;
  documentoCatalogoId: string | null = null;

  agendamentoDetails: Agendamento | null = null;
  triagemDetails: Triagem | null = null;
  documentosNecessarios: DocumentoPendente[] = [];

  agendamentosDisponiveis: Agendamento[] = [];
  triagensDisponiveis: Triagem[] = [];
  tiposDocumentoDisponiveisParaUpload: TipoDocumentoCatalogo[] = [];
  todosOsTiposDeDocumentoDoCatalogo: TipoDocumentoCatalogo[] = [];

  uploadProgress: number = 0;
  uploadMessage: string = '';
  isUploading: boolean = false;
  uploadError: string = '';

  // Conjunto para rastrear URLs de objeto que precisam ser revogadas
  private objectUrls: Set<string> = new Set<string>();

  constructor(
    private uploadService: DocumentoUploadApiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadTiposDocumento();

    this.route.queryParams.subscribe(params => {
      this.agendamentoId = params['agendamentoId'] || null;
      this.triagemId = params['triagemId'] || null;

      if (this.agendamentoId) {
        this.loadAgendamentoDetails(this.agendamentoId);
      } else if (this.triagemId) {
        this.loadTriagemDetails(this.triagemId);
      } else {
        this.loadAgendamentosDoUsuario();
        this.loadTriagensDoUsuario();
        this.documentosNecessarios = [];
        this.uploadError = 'Por favor, selecione um agendamento ou triagem para fazer o upload de documentos.';
      }
    });
  }

  ngOnDestroy(): void {
    // Revoga todas as URLs de objeto para evitar vazamentos de memória
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.objectUrls.clear();
  }

  loadAgendamentosDoUsuario(): void {
    if (!this.agendamentoId && !this.triagemId) {
      this.uploadService.getAgendamentosDoUsuario().subscribe({
        next: (data: Agendamento[]) => {
          this.agendamentosDisponiveis = data;
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
      this.uploadService.getTriagensEmAbertoDoUsuario().subscribe({
        next: (data: Triagem[]) => {
          this.triagensDisponiveis = data;
        },
        error: (err: any) => {
          console.error('Erro ao carregar triagens do usuário:', err);
        }
      });
    }
  }

  loadAgendamentoDetails(id: string): void {
    this.uploadService.getAgendamentoDetails(id).subscribe({
      next: (data: Agendamento) => {
        this.agendamentoDetails = data;
        const tempDocs: DocumentoPendente[] = data.documentosPendentes?.map(doc => ({
          ...doc,
          observacao: doc.observacao || '',
          tempImageUrl: null // Inicializa a nova propriedade
        })) || [];

        this.processDocumentsForDisplay(tempDocs); // Chame o novo método de processamento
        this.filterAvailableDocumentTypes();
        this.uploadError = '';
      },
      error: (err: any) => {
        console.error('Erro ao carregar detalhes do agendamento:', err);
        this.agendamentoDetails = null;
        this.documentosNecessarios = [];
        this.uploadError = 'Erro ao carregar detalhes do agendamento. Pode não existir ou o servidor está fora.';
        this.filterAvailableDocumentTypes();
      }
    });
  }

  loadTriagemDetails(id: string): void {
    this.uploadService.getTriagemDetails(id).subscribe({
      next: (data: Triagem) => {
        this.triagemDetails = data;
        const tempDocs: DocumentoPendente[] = data.documentosPendentes?.map(doc => ({
          ...doc,
          observacao: doc.observacao || '',
          tempImageUrl: null // Inicializa a nova propriedade
        })) || [];

        this.processDocumentsForDisplay(tempDocs); // Chame o novo método de processamento
        this.filterAvailableDocumentTypes();
        this.uploadError = '';
      },
      error: (err: any) => {
        console.error('Erro ao carregar detalhes da triagem:', err);
        this.triagemDetails = null;
        this.documentosNecessarios = [];
        this.uploadError = 'Erro ao carregar detalhes da triagem. Pode não existir ou o servidor está fora.';
        this.filterAvailableDocumentTypes();
      }
    });
  }

  // NOVO MÉTODO: Processa os documentos para download e cria URLs temporárias
  private processDocumentsForDisplay(docs: DocumentoPendente[]): void {
    // Revoga URLs antigas antes de criar novas
    this.objectUrls.forEach(url => URL.revokeObjectURL(url));
    this.objectUrls.clear();

    const downloadObservables = docs.map(doc => {
      if (doc.urlDocumento) {
        return this.uploadService.downloadDocumentoAsBlob(doc.urlDocumento).pipe(
          map(blob => {
            const url = URL.createObjectURL(blob);
            this.objectUrls.add(url); // Adiciona a URL para revogação futura
            doc.tempImageUrl = url; // Atribui a URL temporária
            return doc;
          }),
          catchError(err => {
            console.error(`Erro ao baixar documento ${doc.nomeDocumentoSnapshot}:`, err);
            doc.tempImageUrl = null; // Em caso de erro, não exibe imagem
            // doc.tempImageUrl = 'assets/placeholder-error.png'; // Opcional: imagem de placeholder
            return of(doc); // Retorna o documento original para que o forkJoin não falhe
          })
        );
      } else {
        return of(doc); // Se não houver URL, retorna o documento original
      }
    });

    if (downloadObservables.length > 0) {
      forkJoin(downloadObservables).subscribe({
        next: (resolvedDocs) => {
          this.documentosNecessarios = resolvedDocs;
          console.log('Documentos processados (com URLs de imagem):', this.documentosNecessarios);
        },
        error: (err) => {
          console.error('Erro ao processar downloads de documentos em forkJoin:', err);
          this.documentosNecessarios = docs; // Exibe os documentos mesmo sem as imagens
        }
      });
    } else {
      this.documentosNecessarios = docs;
    }
  }


  loadTiposDocumento(): void {
    this.uploadService.getTiposDocumento().subscribe({
      next: (data: TipoDocumentoCatalogo[]) => {
        this.todosOsTiposDeDocumentoDoCatalogo = data.filter(tipo => tipo.isAtivo);
        if (!this.agendamentoId && !this.triagemId) {
          this.filterAvailableDocumentTypes();
        }
      },
      error: (err: any) => {
        console.error('Erro ao carregar tipos de documento do catálogo:', err);
        this.uploadError = 'Erro ao carregar tipos de documento. Verifique o backend e a rede.';
        this.tiposDocumentoDisponiveisParaUpload = [];
      }
    });
  }


  filterAvailableDocumentTypes(): void {


    if (!this.todosOsTiposDeDocumentoDoCatalogo || this.todosOsTiposDeDocumentoDoCatalogo.length === 0) {
      this.tiposDocumentoDisponiveisParaUpload = [];
      console.warn('[filterAvailableDocumentTypes] Catálogo de tipos de documento ainda não carregado ou vazio. Dropdown de tipos de upload ficará vazio.');
      return;
    }

    if (!this.agendamentoDetails && !this.triagemDetails) {
      this.tiposDocumentoDisponiveisParaUpload = [...this.todosOsTiposDeDocumentoDoCatalogo];
      return;
    }

    if (this.documentosNecessarios && this.documentosNecessarios.length > 0) {
      const tiposPendentesIds = new Set(
        this.documentosNecessarios
          .filter(doc => doc.status !== 'APROVADO')
          .map(doc => doc.documentoCatalogoId)
      );

      this.tiposDocumentoDisponiveisParaUpload = this.todosOsTiposDeDocumentoDoCatalogo.filter(
        catalogoTipo => catalogoTipo.isAtivo && tiposPendentesIds.has(catalogoTipo.id)
      );

    } else {
      this.tiposDocumentoDisponiveisParaUpload = [];
    }
  }

  onAgendamentoSelected(agendamentoId: string): void {
    console.log('[onAgendamentoSelected] Agendamento selecionado:', agendamentoId);
    this.triagemId = null;
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

  onTriagemSelectedDropdown(triagemId: string): void {
    console.log('[onTriagemSelectedDropdown] Triagem selecionada (dropdown):', triagemId);
    this.agendamentoId = null;
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

  onTriagemSelected(triagemId: string): void {
    this.agendamentoId = null;
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

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0] ?? null;
    this.uploadMessage = '';
    this.uploadError = '';
  }

  onUpload(): void {
    this.uploadMessage = '';
    this.uploadError = '';
    this.uploadProgress = 0;

    if (!this.selectedFile) {
      Swal.fire('Atenção', 'Por favor, selecione um arquivo para upload.', 'warning');
      return;
    }
    if (!this.documentoCatalogoId) {
      Swal.fire('Atenção', 'Por favor, selecione o tipo de documento.', 'warning');
      return;
    }
    if (!this.agendamentoId && !this.triagemId) {
      Swal.fire('Atenção', 'Selecione um agendamento ou triagem para associar o documento.', 'warning');
      return;
    }
    if (this.agendamentoId && this.triagemId) {
      this.uploadError = 'O documento não pode estar associado a um ID de Triagem E a um ID de Agendamento simultaneamente.';
      console.warn('[onUpload] Falha: Agendamento e Triagem IDs preenchidos simultaneamente.');
      return;
    }

    this.isUploading = true;
    this.uploadService.uploadDocumento(
      this.triagemId,
      this.agendamentoId,
      this.documentoCatalogoId,
      this.selectedFile
    ).subscribe({
      next: (event: UploadStatus) => {
        if (event.status === 'progress') {
          this.uploadProgress = event.message as number;

        } else if (event.status === 'success') {
          this.isUploading = false;
          this.uploadProgress = 100; // Garante que a barra chegue a 100%

          Swal.fire({
            icon: 'success',
            title: 'Upload Realizado!',
            text: 'Seu documento foi enviado com sucesso.',
            timer: 2000,
            showConfirmButton: false
          }).then(() => {
            this.resetForm();
            if (this.agendamentoId) {
              this.loadAgendamentoDetails(this.agendamentoId);
            } else if (this.triagemId) {
              this.loadTriagemDetails(this.triagemId);
            }
          });
        }
      },
      error: (error: any) => {
        this.isUploading = false;
        console.error('Erro no upload:', error);

        Swal.fire({
          icon: 'error',
          title: 'Falha no Upload',
          text: error.error?.message || 'Não foi possível enviar o seu documento. Tente novamente.',
          confirmButtonColor: '#c62828'
        });
      }
    });
  }

  resetForm(): void {
    this.selectedFile = null;
    this.documentoCatalogoId = null;
    this.uploadProgress = 0;
    this.uploadMessage = '';
    this.uploadError = '';
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
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

  voltarParaMenu(): void {
    this.router.navigate(['/menu-cliente']);
  }

  // NOVO MÉTODO: Abrir o popup da imagem
  openImagePopup(doc: DocumentoPendente): void {
    if (doc.tempImageUrl) {
      Swal.fire({
        title: doc.nomeDocumentoSnapshot,
        html: `<div class="text-center">
                 <img src="${doc.tempImageUrl}" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px;">
               </div>`,
        width: '80%', // Ajuste a largura do popup
        showCloseButton: true,
        showConfirmButton: false, // Não precisa de botão de confirmação se for só para visualização
        customClass: {
          container: 'custom-swal-container', // Opcional: para estilos CSS customizados
          popup: 'custom-swal-popup',
          title: 'custom-swal-title',
          htmlContainer: 'custom-swal-html-container'
        },
        focusConfirm: false,
        didOpen: () => {
          // Opcional: se quiser fazer algo quando o modal abrir
          // Ex: carregar imagem em alta resolução, se doc.tempImageUrl for thumbnail
        },
        willClose: () => {
          // Opcional: se precisar revogar a URL imediatamente após o fechamento do popup
          // Isso já é feito no ngOnDestroy, mas pode ser útil para popups mais isolados
        }
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Erro ao Visualizar',
        text: 'Não foi possível carregar a imagem deste documento. Tente novamente mais tarde.',
        confirmButtonColor: '#c62828'
      });
    }
  }
}