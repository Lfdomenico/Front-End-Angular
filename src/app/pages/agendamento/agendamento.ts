import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AgendamentoApiService } from '../../services/agendamento-api.service';

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

  constructor(private agendamentoApiService: AgendamentoApiService) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.selectedDate = this.minDate;
      this.onDateChange();
    }
  }

  onDateChange(): void {
    if (this.selectedDate) {
      this.agendamentoApiService.getHorariosDisponiveis(this.selectedDate).subscribe({
        next: (times) => {
          const today = new Date(); 
          const selectedLocalDate = new Date(this.selectedDate);

          //
          if (selectedLocalDate.toDateString() === today.toDateString()) {
            this.availableTimes = times.filter(dateTimeString => {
              const slotDateTime = new Date(dateTimeString); 
              return slotDateTime > today; 
            });
          } else {
            this.availableTimes = times;
          }

          console.log('Horários disponíveis (filtrados no front):', this.availableTimes);
        },
        error: (err) => {
          console.error('Erro ao buscar horários disponíveis:', err);
          this.availableTimes = []; 
          alert('Erro ao buscar horários disponíveis. Verifique o console para detalhes.');
        }
      });
    } else {
      this.availableTimes = []; 
    }
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