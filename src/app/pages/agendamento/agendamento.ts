import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoApiService } from '../../services/agendamento-api.service'; // Caminho corrigido

@Component({
  selector: 'app-agendamento',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './agendamento.html',
  styleUrl: './agendamento.scss'
})
export class AgendamentoComponent implements OnInit {
  selectedDate: string = '';
  availableTimes: string[] = [];
  minDate: string;
  selectedRadioTime: string = '';

  // IDs fictícios para teste
  readonly fictitiousUsuarioId: string = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d';
  readonly fictitiousServicoId: string = '2065fc22-9db6-4b6c-bbe1-af25fe8f7cc3'; // Este será enviado ao backend
  readonly fictitiousAtendenteId: string = '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f';


  constructor(private agendamentoApiService: AgendamentoApiService) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    // Ao iniciar, se não houver data selecionada, define a data mínima e busca os horários
    if (!this.selectedDate) {
      this.selectedDate = this.minDate;
      this.onDateChange();
    }
  }

  /**
   * Lida com a mudança na data selecionada pelo usuário.
   * Filtra horários passados para o dia atual e busca horários disponíveis no backend.
   */
  onDateChange(): void {
    if (this.selectedDate) {
      const selectedLocalDate = new Date(this.selectedDate + 'T00:00:00');
      const dayOfWeek = selectedLocalDate.getDay();

      // Validação de fim de semana
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        alert('Fins de semana não estão disponíveis para agendamento. Por favor, escolha um dia de semana.');
        this.selectedDate = '';
        this.availableTimes = [];
        this.selectedRadioTime = '';
        return;
      }

      // Chama o serviço para buscar horários disponíveis, passando o servicoId fictício
      this.agendamentoApiService.getHorariosDisponiveis(this.selectedDate, this.fictitiousServicoId).subscribe({
        next: (times) => {
          const today = new Date();
          const selectedDateOnly = new Date(this.selectedDate + 'T00:00:00');

          // Verifica se a data selecionada é o dia de hoje
          const isToday = selectedDateOnly.getFullYear() === today.getFullYear() &&
                          selectedDateOnly.getMonth() === today.getMonth() &&
                          selectedDateOnly.getDate() === today.getDate();

          if (isToday) {
            // Se for hoje, filtra os horários que já passaram
            this.availableTimes = times.filter(dateTimeString => {
              const slotDateTime = new Date(dateTimeString);
              const currentHour = today.getHours();
              const currentMinute = today.getMinutes();
              const slotHour = slotDateTime.getHours();
              const slotMinute = slotDateTime.getMinutes();

              if (slotHour > currentHour) {
                return true;
              }
              if (slotHour === currentHour) {
                return slotMinute >= currentMinute;
              }
              return false;
            });
          } else {
            // Para datas futuras, exibe todos os horários retornados pelo backend
            this.availableTimes = times;
          }

          this.selectedRadioTime = ''; // Limpa a seleção do rádio ao carregar novos horários
          console.log('Horários disponíveis (filtrados no front):', this.availableTimes);
        },
        error: (err) => {
          console.error('Erro ao buscar horários disponíveis:', err);
          this.availableTimes = [];
          this.selectedRadioTime = '';
          alert('Erro ao buscar horários disponíveis. Verifique o console para detalhes.');
        }
      });
    } else {
      this.availableTimes = [];
      this.selectedRadioTime = '';
    }
  }

  /**
   * Seleciona um horário na tabela quando a linha é clicada.
   * @param time A string de data/hora do horário selecionado.
   */
  selectRow(time: string): void {
    this.selectedRadioTime = time;
    console.log('Horário selecionado:', this.selectedRadioTime);
  }

  /**
   * Tenta agendar o horário selecionado.
   */
  agendarHorario(): void {
    console.log('Valor de selectedRadioTime ao clicar em Agendar:', this.selectedRadioTime);
    if (!this.selectedRadioTime) {
      alert('Por favor, selecione um horário disponível para agendar.');
      return;
    }

    // Cria o objeto DTO que o backend espera para o agendamento
    const agendamentoData = {
      usuarioId: this.fictitiousUsuarioId,
      servicoId: this.fictitiousServicoId,
      atendenteId: this.fictitiousAtendenteId,
      dataHora: this.selectedRadioTime // Já está no formato 'YYYY-MM-DDTHH:MM:SS'
    };

    console.log('Tentando agendar:', agendamentoData);

    // Chama o serviço para enviar os dados ao backend
    this.agendamentoApiService.salvarAgendamento(agendamentoData).subscribe({
      next: (response) => {
        alert('Agendamento realizado com sucesso!');
        console.log('Resposta do agendamento:', response);
        // Recarrega a lista de horários disponíveis para refletir a nova ocupação
        this.onDateChange();
        this.selectedRadioTime = ''; // Limpa a seleção após agendar
      },
      error: (error) => {
        console.error('Erro ao agendar:', error);
        let errorMessage = 'Erro ao agendar. Tente novamente.';
        if (error.error && error.error.message) {
          errorMessage = `Erro ao agendar: ${error.error.message}`;
        }
        alert(errorMessage);
      }
    });
  }

  /**
   * Formata uma string de data/hora para exibir apenas a data.
   * @param dateTimeString A string de data/hora.
   * @returns A data formatada.
   */
  getFormattedDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('pt-BR');
  }

  /**
   * Formata uma string de data/hora para exibir apenas o horário.
   * @param dateTimeString A string de data/hora.
   * @returns O horário formatado.
   */
  getFormattedTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
