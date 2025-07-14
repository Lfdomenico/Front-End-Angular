import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { AgendamentoApiService } from '../../services/agendamento-api.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { ClienteService } from '../../services/cliente.service';

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss'
})
export class AgendamentoComponent implements OnInit {
  selectedDate: string = '';
  availableTimes: string[] = [];
  minDate: string;
  selectedRadioTime: string = '';

  servicoId: string | null = null;
  tempoEstimadoServico: number | null = null;

  private clienteService = inject(ClienteService);
  private usuarioId = this.clienteService.getId();

  constructor(
    private agendamentoApiService: AgendamentoApiService,
    private route: ActivatedRoute, 
    private router: Router
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.servicoId = params.get('id');
      console.log('AgendamentoComponent: servicoId lido do paramMap:', this.servicoId);

      if (!this.servicoId) {
        alert('ID do serviço não especificado na URL. Por favor, selecione um serviço na tela anterior.');
        return; 
      }

      if (!this.selectedDate) {
        this.selectedDate = this.minDate;
        this.onDateChange(); 
      }
    });

    this.route.queryParams.subscribe(params => {
      this.tempoEstimadoServico = params['tempo'] ? +params['tempo'] : null;
      console.log('AgendamentoComponent: tempoEstimadoServico lido do queryParams:', this.tempoEstimadoServico);
    });
  }

  onDateChange(): void {
    if (!this.servicoId || !this.selectedDate) {
      this.availableTimes = [];
      this.selectedRadioTime = '';
      return;
    }

    const selectedLocalDate = new Date(this.selectedDate + 'T00:00:00');
    const dayOfWeek = selectedLocalDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      alert('Fins de semana não estão disponíveis para agendamento. Escolha um dia de semana.');
      this.selectedDate = ''; 
      this.availableTimes = [];
      this.selectedRadioTime = '';
      return;
    }

    this.agendamentoApiService
      .getHorariosDisponiveis(this.selectedDate, this.servicoId)
      .subscribe({
        next: times => {
          const today = new Date();
          const isToday =
            selectedLocalDate.getFullYear() === today.getFullYear() &&
            selectedLocalDate.getMonth() === today.getMonth() &&
            selectedLocalDate.getDate() === today.getDate();

          this.availableTimes = isToday
            ? times.filter(slot => {
                const slotDateTime = new Date(slot);
                const h = slotDateTime.getHours(), m = slotDateTime.getMinutes();
                if (h > today.getHours()) return true;
                if (h === today.getHours()) return m >= today.getMinutes();
                return false;
              })
            : times;

          this.selectedRadioTime = '';
        },
        error: err => {
          console.error('Erro ao buscar horários:', err);
          this.availableTimes = [];
          this.selectedRadioTime = '';
          alert('Erro ao buscar horários disponíveis. Veja o console.');
        }
      });
  }

  selectRow(time: string): void {
    this.selectedRadioTime = time;
  }

  agendarHorario(): void {
    if (!this.selectedRadioTime || !this.servicoId ) {
      alert('Selecione um horário e um serviço antes de continuar.'); 
      return;
    }

    const agendamentoData = {
      usuarioId: this.usuarioId,
      servicoId: this.servicoId,
      atendenteId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
      dataHora: this.selectedRadioTime
    };

    this.agendamentoApiService.salvarAgendamento(agendamentoData).subscribe({
      next: response => {
        alert('Agendamento realizado com sucesso!');
        this.router.navigate(['/documentos/upload'], {
          queryParams: { agendamentoId: response.id }
        });
      },
      error: error => {
        console.error('Erro ao agendar:', error);
        const msg = error.error?.message
          ? `Erro ao agendar: ${error.error.message}`
          : 'Erro ao agendar. Tente novamente.';
        alert(msg);
      }
    });
  }

  getFormattedDate(slot: string): string {
    return new Date(slot).toLocaleDateString('pt-BR');
  }

  getFormattedTime(slot: string): string {
    return new Date(slot).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}