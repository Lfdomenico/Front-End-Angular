import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { CatalogoApiService, ServicoBackend } from '../../services/catalogo-api.service';

interface ServicoDisplay extends ServicoBackend {
  iconClass: string;
  rota: string;
}

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.scss']
})
export class MenuClienteComponent implements OnInit {
  setores: ServicoDisplay[] = []; 

  constructor(
    private router: Router,
    private catalogoApiService: CatalogoApiService
  ) {}

  ngOnInit(): void {
    this.carregarServicos();
  }

  carregarServicos(): void {
    this.catalogoApiService.getTodosOsServicos().subscribe({
      next: (servicosBackend: ServicoBackend[]) => {
        this.setores = servicosBackend.map(servico => this.mapServicoToDisplay(servico));
        console.log('Serviços carregados do backend e mapeados para exibição:', this.setores);
      },
      error: (err) => {
        console.error('Erro ao carregar serviços do backend:', err);
        alert('Não foi possível carregar os serviços. Por favor, tente novamente mais tarde.');
        this.setores = [];
      }
    });
  }

  private mapServicoToDisplay(servico: ServicoBackend): ServicoDisplay {
    let iconClass = 'fa fa-question-circle';
    let rota = '/espera';

    // Lógica para atribuir iconClass e rota (AJUSTE CONFORME SEUS SERVIÇOS REAIS)
    if (servico.nome.includes('Conta')) {
      iconClass = 'fa fa-university';
      rota = '/agendamento'; 
    } else if (servico.nome.includes('Cartão')) {
      iconClass = 'fa fa-credit-card';
      rota = '/espera';
    } else if (servico.nome.includes('Fraude')) {
      iconClass = 'fa fa-search';
      rota = '/agendamento';
    } else if (servico.nome.includes('Dívidas')) {
      iconClass = 'fa fa-money-bill-alt';
      rota = '/espera';
    } else if (servico.nome.includes('App') || servico.nome.includes('Banking')) {
      iconClass = 'fa fa-headset';
      rota = '/espera';
    } else if (servico.nome.includes('Informações')) {
      iconClass = 'fa fa-info-circle';
      rota = '/espera';
    }

    return {
      ...servico,
      iconClass: iconClass,
      rota: rota
    };
  }

  selecionarSetor(setor: ServicoDisplay): void {
    if (setor.rota === '/agendamento') {
      // Passa o ID do serviço e o tempo médio em minutos para a tela de agendamento
      this.router.navigate([setor.rota], { queryParams: { servicoId: setor.id, tempo: setor.tempoMedioMinutos } });
    } else {
      this.router.navigate([setor.rota], { queryParams: { nomeSetor: setor.nome, tempo: setor.tempoMedioMinutos } });
    }
  }
}