import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';
import { CatalogoApiService, ServicoBackend, TriagemResponse } from '../../services/catalogo-api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmationModalComponent } from '../../components/confirmationmodal/confirmationmodal';
import { TriagemApiService } from '../../services/triagem-api.service';

interface ServicoDisplay extends ServicoBackend {
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
    private triagemApiService: TriagemApiService,
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
    let rota = '/espera';

    if (servico.tempoMedioMinutos >= 15) {
      rota = '/agendamento';
    }
    return {
      ...servico,
      rota: rota
    };
  }

  confirmarSelecao(setor: ServicoDisplay): void {
    this.setorParaConfirmar = setor;
    let horario: TriagemResponse;
    this.triagemApiService.getHorarioDisponivel().subscribe((response: TriagemResponse) => {
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
    const triagemData = {
      servicoId: setor.id,
      prioridade: 1
    };
    this.triagemApiService.salvarTriagem(triagemData).subscribe({
      // MUDANÇA AQUI: Renomeie 'response' para 'triagemCriada' para clareza
      next: (triagemCriada) => {
        console.log('Triagem criada, redirecionando para a tela de espera com o ID:', triagemCriada.id);

        // A NAVEGAÇÃO AGORA USA O ID DA TRIAGEM CRIADA
        // O Angular vai gerar uma URL como: /espera/SEU_ID_AQUI
        this.router.navigate(['/espera', triagemCriada.id]);
      },
      error: error => {
        console.error('Erro ao criar triagem:', error);
        const msg = error.error?.message
          ? `Erro ao entrar na fila: ${error.error.message}`
          : 'Erro ao entrar na fila. Tente novamente.';
        alert(msg);
      }
    });
  }
}
}