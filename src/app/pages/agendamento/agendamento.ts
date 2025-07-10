import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoApiService } from '../../services/agendamento-api.service';
import { ActivatedRoute } from '@angular/router';

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
  public setorSelecionado: string = '';

  constructor(
    private agendamentoApiService: AgendamentoApiService,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.setorSelecionado = this.route.snapshot.paramMap.get('setorNome') || 'Agendamento';
    if (!this.selectedDate) {
      this.selectedDate = this.minDate;
      this.onDateChange();
    }
  }

  onDateChange(): void {
    if (this.selectedDate) {
      const selectedLocalDate = new Date(this.selectedDate + 'T00:00:00'); 
      const dayOfWeek = selectedLocalDate.getDay();

      if (dayOfWeek === 0 || dayOfWeek === 6) {
        alert('Fins de semana não estão disponíveis para agendamento. Por favor, escolha um dia de semana.');
        this.selectedDate = '';
        this.availableTimes = [];
        this.selectedRadioTime = '';
        return;
      }

      this.agendamentoApiService.getHorariosDisponiveis(this.selectedDate).subscribe({
        next: (times) => {
          const today = new Date(); 

          const isToday = selectedLocalDate.getFullYear() === today.getFullYear() &&
                          selectedLocalDate.getMonth() === today.getMonth() &&
                          selectedLocalDate.getDate() === today.getDate();

          if (isToday) {
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
            this.availableTimes = times;
          }

          this.selectedRadioTime = '';
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

  selectRow(time: string): void {
    this.selectedRadioTime = time;
    console.log('Horário selecionado:', this.selectedRadioTime);
  }

  getFormattedDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('pt-BR');
  }

  getFormattedTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}