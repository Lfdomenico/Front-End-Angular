import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import { IconPickerModalComponent } from '../../components/icon-picker-modal.component/icon-picker-modal.component';
import { CatalogoApiService, SetorRequest } from '../../services/catalogo-api.service'; 

interface Documento {
  id: string; 
  nome: string;
}

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
  // Propriedades existentes do formulário
  nomeSetor: string = '';
  descricaoSetor: string = '';
  selectedSectorIcon: string = 'fa-solid fa-search';
  isAtivo: boolean = true;
  prioridade: number = 1;
  tempoMedioMinutos: number | null = null;

  // NOVAS PROPRIEDADES PARA DOCUMENTOS
  availableDocuments: Documento[] = [];
  selectedDocumentIds: string[] = [];
  isDocumentDropdownOpen: boolean = false;

  // <<-- INJEÇÃO DO SERVIÇO AQUI
  constructor(private catalogoApiService: CatalogoApiService) { }

  ngOnInit(): void {
    this.fetchDocuments();
  }

  fetchDocuments(): void {
    // Dados de exemplo (UUIDs simulados)
    this.availableDocuments = [
      { id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', nome: 'Comprovante de Residência' },
      { id: 'b2c3d4e5-f6a7-8901-2345-67890abcdef0', nome: 'Documento de Identidade' },
      { id: 'c3d4e5f6-a7b8-9012-3456-7890abcdef01', nome: 'Comprovante de Renda' },
      { id: 'd4e5f6a7-b8c9-0123-4567-890abcdef012', nome: 'Extrato Bancário' },
      { id: 'e5f6a7b8-c9d0-1234-5678-90abcdef0123', nome: 'Certidão de Nascimento/Casamento' }
    ];
  }

  toggleDocumentDropdown(): void {
    this.isDocumentDropdownOpen = !this.isDocumentDropdownOpen;
  }

  isDocumentSelected(documentId: string): boolean {
    return this.selectedDocumentIds.includes(documentId);
  }

  selectDocument(documento: Documento): void {
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
    const setorDTO: SetorRequest = { 
      nome: this.nomeSetor,
      descricao: this.descricaoSetor,
      isAtivo: this.isAtivo,
      prioridade: this.prioridade,
      tempoMedioMinutos: this.tempoMedioMinutos,
      documentosObrigatoriosIds: this.selectedDocumentIds,
      icone: this.selectedSectorIcon
    };

    console.log('DTO do Setor a ser enviado:', setorDTO);

    this.catalogoApiService.cadastrarSetor(setorDTO).subscribe({
      next: (response) => {
        console.log('Setor cadastrado com sucesso!', response);
        alert('Setor cadastrado com sucesso!');
        this.resetForm();
      },
      error: (error) => {
        console.error('Erro ao cadastrar setor:', error);
        alert('Erro ao cadastrar setor. Verifique o console para mais detalhes.');
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
}