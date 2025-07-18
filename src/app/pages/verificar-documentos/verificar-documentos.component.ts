import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, map, switchMap } from 'rxjs';

// Componentes e Serviços
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TriagemApiService } from '../../services/triagem-api.service';
import { CatalogoApiService, ServicoBackend } from '../../services/catalogo-api.service';
import { TriagemCompleta } from '../../services/triagem.interface';

// Interface para o nosso checklist unificado
export interface DocumentoChecklist {
  nome: string;
  status: 'ENVIADO' | 'PENDENTE';
  urlDocumento?: string | null;
}

@Component({
  selector: 'app-verificar-documentos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './verificar-documentos.component.html',
  styleUrl: './verificar-documentos.component.scss'
})
export class VerificarDocumentosComponent implements OnInit {

  public isLoading = true;
  public erroMsg: string | null = null;
  public triagemDetalhes: TriagemCompleta | null = null;
  public documentosChecklist: DocumentoChecklist[] = [];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private triagemService: TriagemApiService,
    private catalogoService: CatalogoApiService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        const triagemId = params.get('id');
        if (!triagemId) {
          throw new Error('ID da triagem não fornecido na rota.');
        }
        return this.triagemService.getById(triagemId);
      }),
      switchMap(triagem => {
        this.triagemDetalhes = triagem;
        return this.catalogoService.getServicoById(triagem.servicoId);
      })
    ).subscribe({
      next: (servico) => {
        this.processarChecklist(this.triagemDetalhes!, servico);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar dados para verificação:', err);
        this.erroMsg = 'Falha ao carregar os detalhes da verificação.';
        this.isLoading = false;
      }
    });
  }
  private processarChecklist(triagem: TriagemCompleta, servico: ServicoBackend): void {
    const checklist: DocumentoChecklist[] = [];
    const documentosEnviados = new Map(triagem.documentosPendentes.map(doc => [doc.documentoCatalogoId, doc]));

    // Para cada documento obrigatório do serviço...
    for (const docId of servico.documentosObrigatoriosIds) {
      const docEnviado = documentosEnviados.get(docId);

      if (docEnviado && docEnviado.status === 'ENVIADO') {
        // Se o cliente enviou e o status é ENVIADO
        checklist.push({
          nome: docEnviado.nomeDocumentoSnapshot,
          status: 'ENVIADO',
          urlDocumento: docEnviado.urlDocumento
        });
      } else {
        // Se o cliente não enviou, o documento está PENDENTE
        // Precisaríamos de mais uma chamada ao catálogo para saber o nome do documento
        // Por simplicidade, vamos usar o ID por enquanto.
        checklist.push({
          nome: `Documento Obrigatório (ID: ${docId})`,
          status: 'PENDENTE'
        });
      }
    }
    this.documentosChecklist = checklist;
  }

  public voltar(): void {
    this.router.navigate(['/menu-funcionario']);
  }
}