// src/app/pages/cadastro-setor/cadastro-setor.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from "../../components/navbar/navbar.component";
import { IconPickerModalComponent } from '../../components/icon-picker-modal.component/icon-picker-modal.component';

// Importe o serviço e a interface SetorRequest
import { CatalogoApiService, SetorRequest } from '../../services/catalogo-api.service'; // <<-- Importe o serviço e a interface

// Interface para o Documento (simulando a estrutura do banco de dados)
interface Documento {
  id: string; // Será o UUID
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
  selectedSectorIcon: string = 'fa-solid fa-building-columns';
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
    // Constrói o objeto DTO conforme a interface SetorRequest
    const setorDTO: SetorRequest = { // <<-- Garanta que o tipo é SetorRequest
      nome: this.nomeSetor,
      descricao: this.descricaoSetor,
      isAtivo: this.isAtivo,
      prioridade: this.prioridade,
      tempoMedioMinutos: this.tempoMedioMinutos,
      documentosObrigatoriosIds: this.selectedDocumentIds,
      icone: this.selectedSectorIcon
    };

    console.log('DTO do Setor a ser enviado:', setorDTO);

    // <<-- CHAMADA À API AQUI
    this.catalogoApiService.cadastrarSetor(setorDTO).subscribe({
      next: (response) => {
        // Lógica para lidar com a resposta de sucesso da API
        console.log('Setor cadastrado com sucesso!', response);
        alert('Setor cadastrado com sucesso!');
        // Opcional: Limpar o formulário ou redirecionar
        // this.resetForm();
      },
      error: (error) => {
        // Lógica para lidar com erros da API
        console.error('Erro ao cadastrar setor:', error);
        alert('Erro ao cadastrar setor. Verifique o console para mais detalhes.');
      },
      complete: () => {
        // Opcional: Lógica a ser executada quando o Observable é concluído (sucesso ou erro)
        console.log('Requisição de cadastro de setor concluída.');
      }
    });
  }

  getFaIconArray(iconClass: string): string {
    return iconClass;
  }

  // Opcional: Método para resetar o formulário após o sucesso
  // resetForm(): void {
  //   this.nomeSetor = '';
  //   this.descricaoSetor = '';
  //   this.isAtivo = true;
  //   this.prioridade = 1;
  //   this.tempoMedioMinutos = null;
  //   this.selectedDocumentIds = [];
  //   this.selectedSectorIcon = 'fa-solid fa-building-columns';
  //   // Se estiver usando Template-driven Forms, você pode precisar de:
  //   // this.setorForm.resetForm(); // Assumindo que você tem uma referência #setorForm no HTML
  // }
}