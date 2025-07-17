// Em: historico-atendimentos.component.ts

import { Component, OnInit, OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Triagem, TriagemApiService } from '../../services/triagem-api.service'; // Importe o serviço e a interface

@Component({
  selector: 'app-historico-atendimentos',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './historico-atendimentos.component.html',
  styleUrl: './historico-atendimentos.component.scss'
})
export class HistoricoAtendimentosComponent implements OnInit, OnDestroy {

  historico: Triagem[] = [];
  isLoading = true;

  // Injete o serviço de triagem
  constructor(private triagemService: TriagemApiService) { }

  ngOnInit(): void {
    document.body.classList.add('menu-funcionario-bg');

    this.triagemService.getAll().subscribe({
      next: (todasAsTriagens) => {
        // Filtramos para pegar apenas as finalizadas
        this.historico = todasAsTriagens.filter(t => t.status === 'FINALIZADO');
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico', err);
        this.isLoading = false;
        // Opcional: mostrar uma mensagem de erro na tela
      }
    });
  }

  ngOnDestroy(): void {
    // Remove a classe para que outras páginas voltem a ter o fundo padrão
    document.body.classList.remove('menu-funcionario-bg');
  }
}