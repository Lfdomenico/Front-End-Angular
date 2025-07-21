import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Triagem, TriagemApiService } from '../../services/triagem-api.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <-- 1. IMPORTAR FormsModule
import { TriagemCompleta } from '../../services/triagem.interface';

@Component({
  selector: 'app-historico-atendimentos',
  standalone: true,
  imports: [CommonModule, NavbarComponent, FormsModule], // <-- 2. ADICIONAR FormsModule AOS IMPORTS
  templateUrl: './historico-atendimentos.component.html',
  styleUrl: './historico-atendimentos.component.scss'
})
export class HistoricoAtendimentosComponent implements OnInit, OnDestroy {

  private historicoCompleto: TriagemCompleta[] = [];
  public historicoExibido: TriagemCompleta[] = [];
  public termoBusca: string = '';
  public isLoading = true;
  public colunaOrdenada: string = 'horarioSolicitacao';
  public direcaoOrdenacao: 'asc' | 'desc' = 'desc';

  constructor(
    private triagemService: TriagemApiService, 
    private router: Router
  ) { }

  ngOnInit(): void {
    document.body.classList.add('menu-funcionario-bg');

    this.triagemService.getHistorico().subscribe({
      next: (triagensFinalizadas) => {
        this.historicoCompleto = triagensFinalizadas;
        this.historicoExibido = [...this.historicoCompleto];
        this.ordenarDados();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar histórico', err);
        this.isLoading = false;
      }
    });
  }

  filtrarHistorico(): void {
    const termo = this.termoBusca.toLowerCase().trim();

    if (!termo) {
      this.historicoExibido = [...this.historicoCompleto];
      
    }else{
      this.historicoExibido = this.historicoCompleto.filter(h => {
        const nomeCliente = (h.nomeClienteSnapshot || '').toLowerCase();
        const nomeServico = (h.nomeServicoSnapshot || '').toLowerCase();
        return nomeCliente.includes(termo) || nomeServico.includes(termo);
      });
    }
    this.ordenarDados(); 
  }
  ordenarPor(coluna: string): void {
    if (this.colunaOrdenada === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenada = coluna;
      this.direcaoOrdenacao = coluna === 'horarioSolicitacao' ? 'desc' : 'asc';
    }
    this.ordenarDados();
  }
  
  private ordenarDados(): void {
    this.historicoExibido.sort((a, b) => {
      let valorA, valorB;

      
      if (this.colunaOrdenada === 'nomeClienteSnapshot') {
        valorA = (a.nomeClienteSnapshot || '').toLowerCase();
        valorB = (b.nomeClienteSnapshot || '').toLowerCase();
        return this.direcaoOrdenacao === 'asc' ? valorA.localeCompare(valorB) : valorB.localeCompare(valorA);
      }
      
      if (this.colunaOrdenada === 'horarioSolicitacao') {
        valorA = new Date(a.horarioSolicitacao).getTime();
        valorB = new Date(b.horarioSolicitacao).getTime();
        return this.direcaoOrdenacao === 'asc' ? valorA - valorB : valorB - valorA;
      }

      return 0;
    });
  }
  ngOnDestroy(): void {
    document.body.classList.remove('menu-funcionario-bg');
  }

  retornar(): void {
    this.router.navigate(['/menu-funcionario/triagens']);
  }
  verDetalhes(atendimento: TriagemCompleta): void {
  this.router.navigate(['/menu-funcionario/historico-atendimentos', atendimento.id]);
  }
}