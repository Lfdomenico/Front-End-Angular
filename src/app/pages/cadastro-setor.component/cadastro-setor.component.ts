import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { IconPickerModalComponent } from '../../components/icon-picker-modal.component/icon-picker-modal.component';
import { CatalogoApiService, SetorRequest, DocumentoResponse } from '../../services/catalogo-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-setor.component',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    IconPickerModalComponent
  ],
  templateUrl: './cadastro-setor.component.html',
  styleUrl: './cadastro-setor.component.scss'
})
export class CadastroSetorComponent implements OnInit {
  nomeSetor: string = '';
  descricaoSetor: string = '';
  selectedSectorIcon: string = 'fa-solid fa-search';
  isAtivo: boolean = true;
  prioridade: number = 1;
  tempoMedioMinutos: number | null = null;

  availableDocuments: DocumentoResponse[] = [];
  selectedDocumentIds: string[] = [];
  isDocumentDropdownOpen: boolean = false;

  modalSetoresAberta = false;
  setoresCadastrados: any[] = [];

  constructor(private catalogoApiService: CatalogoApiService, private router: Router) { }

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    this.catalogoApiService.getDocumentos().subscribe({
      next: (data: DocumentoResponse[]) => {
        this.availableDocuments = data;
        console.log('Documentos carregados da API:', this.availableDocuments);
      },
      error: (error) => {
        alert('Erro ao buscar documentos. Por favor, tente novamente mais tarde.');
        console.error('Erro ao buscar documentos:', error);
      }
    });
  }

  toggleDocumentDropdown(): void {
    this.isDocumentDropdownOpen = !this.isDocumentDropdownOpen;
  }

  isDocumentSelected(documentId: string): boolean {
    return this.selectedDocumentIds.includes(documentId);
  }

  selectDocument(documento: DocumentoResponse): void {
    const index = this.selectedDocumentIds.indexOf(documento.id);
    if (index === -1) {
      this.selectedDocumentIds.push(documento.id);
    } else {
      this.selectedDocumentIds.splice(index, 1);
    }
  }

  removeDocument(documentId: string): void {
    const index = this.selectedDocumentIds.indexOf(documentId);
    if (index !== -1) {
      this.selectedDocumentIds.splice(index, 1);
    }
  }

  getDocumentNameById(id: string): string {
    const doc = this.availableDocuments.find(d => d.id === id);
    return doc ? doc.nome : 'Documento Desconhecido';
  }

  onIconSelected(iconClass: string): void {
    this.selectedSectorIcon = iconClass;
    console.log('Ícone selecionado para o setor:', this.selectedSectorIcon);
  }

  salvarSetor(): void {
    if (!this.nomeSetor.trim()) {
      alert('Por favor, preencha o nome do setor.');
      return;
    }

    if (this.tempoMedioMinutos !== null && this.tempoMedioMinutos < 0) {
      alert('O tempo médio em minutos não pode ser negativo.');
      return;
    }

    if (this.tempoMedioMinutos !== null && this.tempoMedioMinutos > 60) {
      alert('O tempo médio em minutos não pode ultrapassar 60 minutos.');
      return;
    }

    const setorDTO: SetorRequest = {
      nome: this.nomeSetor,
      descricao: this.descricaoSetor,
      isAtivo: this.isAtivo,
      prioridade: this.prioridade,
      tempoMedioMinutos: this.tempoMedioMinutos,
      documentosObrigatoriosIds: this.selectedDocumentIds,
      icone: this.selectedSectorIcon
    };

    this.catalogoApiService.cadastrarSetor(setorDTO).subscribe({
      next: (response) => {
        console.log('Setor cadastrado com sucesso!', response);
        alert('Setor cadastrado com sucesso!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Erro ao cadastrar setor:', error);
        alert('Erro ao cadastrar setor.');
      },
      complete: () => {
        console.log('Requisição de cadastro de setor concluída.');
      }
    });
  }

  getFaIconArray(iconClass: string): string {
    return iconClass;
  }

  resetForm(): void {
    this.nomeSetor = '';
    this.descricaoSetor = '';
    this.isAtivo = true;
    this.prioridade = 1;
    this.tempoMedioMinutos = null;
    this.selectedDocumentIds = [];
    this.selectedSectorIcon = 'fa-solid fa-search';
  }

  retornar(): void {
    this.router.navigate(['/menu-funcionario']);
  }

  abrirModalSetores() {
    this.modalSetoresAberta = true;
    this.catalogoApiService.getTodosOsServicos().subscribe({
      next: (data) => this.setoresCadastrados = data,
      error: () => alert('Erro ao buscar setores.')
    });
  }

  fecharModalSetores() {
    this.modalSetoresAberta = false;
  }

  excluirSetor(id: string) {
    if (confirm('Tem certeza que deseja excluir este setor?')) {
      this.catalogoApiService.excluirSetor(id).subscribe({
        next: () => {
          this.setoresCadastrados = this.setoresCadastrados.filter(s => s.id !== id);
          alert('Setor excluído com sucesso!');
        },
        error: () => alert('Erro ao excluir setor.')
      });
    }
  }
}