import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { CatalogoApiService, ServicoBackend, TriagemResponse } from '../../services/catalogo-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/confirmationmodal/confirmationmodal';

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
  private setorParaConfirmar: ServicoDisplay | null = null;

  constructor(
    private router: Router,
    private catalogoApiService: CatalogoApiService,
    private modalService: NgbModal
  ) { }

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
      rota = '/agendamento';
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

  confirmarSelecao(setor: ServicoDisplay): void {
    this.setorParaConfirmar = setor;
    let horario: TriagemResponse;
    this.catalogoApiService.getHorarioDisponivel().subscribe((response: TriagemResponse) => {
      horario = response;
      const horaFormatada = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(horario.disponibilidade));

      const modalRef = this.modalService.open(ConfirmationModalComponent, { centered: true });

      modalRef.componentInstance.title = 'Confirmação de Ação';
      modalRef.componentInstance.message = `Você deseja realmente solicitar atendimento para: <strong>${setor.nome}</strong>?`;
      if(setor.rota =='/espera'){
        modalRef.componentInstance.message += `<br>Provável horario de atendimento às: <strong>${horaFormatada}</strong>`;
      }
      modalRef.componentInstance.confirmButtonText = 'Sim, continuar';

      modalRef.result.then(
        (result) => {
          if (result === true && this.setorParaConfirmar) {
            console.log(`Usuário confirmou a seleção do setor: ${this.setorParaConfirmar.nome}`);
            this.executarSelecaoSetor(this.setorParaConfirmar);
          } else {
            console.log(`Usuário cancelou a seleção do setor: ${this.setorParaConfirmar?.nome || 'Nenhum setor'}`);
          }
          this.setorParaConfirmar = null;
        },
        (reason) => {
          console.log(`Modal fechado por: ${reason}. Ação cancelada.`);
          this.setorParaConfirmar = null;
        }
      );
    });
  }

  private executarSelecaoSetor(setor: ServicoDisplay): void {
    if (setor.rota === '/agendamento') {
      this.router.navigate([setor.rota, setor.id], { queryParams: { tempo: setor.tempoMedioMinutos } });
    } else {
      this.router.navigate(['/espera', setor.nome], { queryParams: { tempo: setor.tempoMedioMinutos } });
    }
  }
}