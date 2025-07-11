import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute
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

  clienteService = inject(ClienteService);
  usuarioId = this.clienteService.getId(); // Mantendo um usuário fictício por enquanto


  constructor(
    private agendamentoApiService: AgendamentoApiService,
    private route: ActivatedRoute
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.servicoId = params['servicoId'] || null;
      this.tempoEstimadoServico = params['tempo'] ? +params['tempo'] : null; 

      console.log('Parâmetros recebidos na tela de agendamento:');
      console.log('servicoId:', this.servicoId);
      console.log('tempoEstimadoServico:', this.tempoEstimadoServico);

      if (!this.servicoId) {
        alert('Serviço não especificado. Por favor, selecione um serviço na tela anterior.');
        return; 
      }

      if (!this.selectedDate) {
        this.selectedDate = this.minDate;
        this.onDateChange();
      }
    });
  }

  onDateChange(): void {
    if (!this.servicoId) {
      console.warn('servicoId não disponível para buscar horários.');
      this.availableTimes = [];
      this.selectedRadioTime = '';
      return;
    }

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

      this.agendamentoApiService.getHorariosDisponiveis(this.selectedDate, this.servicoId).subscribe({
        next: (times) => {
          const today = new Date();
          const selectedDateOnly = new Date(this.selectedDate + 'T00:00:00');

          const isToday = selectedDateOnly.getFullYear() === today.getFullYear() &&
                          selectedDateOnly.getMonth() === today.getMonth() &&
                          selectedDateOnly.getDate() === today.getDate();

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

  selectRow(time: string): void {
    this.selectedRadioTime = time;
    console.log('Horário selecionado:', this.selectedRadioTime);
  }

  agendarHorario(): void {
    if (!this.selectedRadioTime || !this.servicoId || !this.usuarioId) {
      alert('Por favor, selecione um horário e garanta que o serviço e usuário estão definidos.');
      return;
    }

    const agendamentoData = {
      usuarioId: this.usuarioId, // Usando o usuárioId (fictício por enquanto)
      servicoId: this.servicoId, 
      atendenteId: '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f', // Mantendo atendenteId fictício por enquanto
      dataHora: this.selectedRadioTime // Já está no formato 'YYYY-MM-DDTHH:MM:SS'
    };

    console.log('Tentando agendar:', agendamentoData);

    this.agendamentoApiService.salvarAgendamento(agendamentoData).subscribe({
      next: (response) => {
        alert('Agendamento realizado com sucesso!');
        console.log('Resposta do agendamento:', response);
        this.onDateChange();
        this.selectedRadioTime = ''; 
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

  getFormattedDate(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('pt-BR');
  }

  getFormattedTime(dateTimeString: string): string {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}

// @Component({
//   selector: 'app-agendamento',
//   standalone: true,
//   imports: [
//     CommonModule,
//     FormsModule,
//     NavbarComponent
//   ],
//   templateUrl: './agendamento.html',
//   styleUrl: './agendamento.scss'
// })
// export class AgendamentoComponent implements OnInit {
//   selectedDate: string = '';
//   availableTimes: string[] = [];
//   minDate: string;
//   selectedRadioTime: string = '';
//   // variavel para guardar o ID do serviço vindo da rota.
//   servicoId: string | null = null;

//   // IDs fictícios para teste
//   readonly fictitiousUsuarioId: string = '1a2b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d';
//   readonly fictitiousServicoId: string = '2065fc22-9db6-4b6c-bbe1-af25fe8f7cc3'; 
//   readonly fictitiousAtendenteId: string = '3c4d5e6f-7a8b-9c0d-1e2f-3a4b5c6d7e8f';


//   constructor(private agendamentoApiService: AgendamentoApiService, private route: ActivatedRoute) {
//     const today = new Date();
//     this.minDate = today.toISOString().split('T')[0];
//   }

//   ngOnInit(): void {
//     // 4. CAPTURE O ID DA URL QUANDO O COMPONENTE INICIAR
//     this.servicoId = this.route.snapshot.paramMap.get('id');

//     if (!this.servicoId) {
//       console.error("ID do serviço não foi encontrado na URL!");
//       alert("Erro: Serviço não especificado.");
//       // Opcional: redirecionar de volta para o menu
//       // this.router.navigate(['/menu-cliente']);
//       return;
//     }

//     if (!this.selectedDate) {
//       this.selectedDate = this.minDate;
//       this.onDateChange();
//     }
//   }

  
//   onDateChange(): void {
//     if (this.selectedDate && this.servicoId) {
//       const selectedLocalDate = new Date(this.selectedDate + 'T00:00:00');
//       const dayOfWeek = selectedLocalDate.getDay();

//       if (dayOfWeek === 0 || dayOfWeek === 6) {
//         alert('Fins de semana não estão disponíveis para agendamento. Por favor, escolha um dia de semana.');
//         this.selectedDate = '';
//         this.availableTimes = [];
//         this.selectedRadioTime = '';
//         return;
//       }

//       this.agendamentoApiService.getHorariosDisponiveis(this.selectedDate, this.servicoId).subscribe({
//         next: (times) => {
//           const today = new Date();
//           const selectedDateOnly = new Date(this.selectedDate + 'T00:00:00');

//           const isToday = selectedDateOnly.getFullYear() === today.getFullYear() &&
//                           selectedDateOnly.getMonth() === today.getMonth() &&
//                           selectedDateOnly.getDate() === today.getDate();

//           if (isToday) {
//             this.availableTimes = times.filter(dateTimeString => {
//               const slotDateTime = new Date(dateTimeString);
//               const currentHour = today.getHours();
//               const currentMinute = today.getMinutes();
//               const slotHour = slotDateTime.getHours();
//               const slotMinute = slotDateTime.getMinutes();

//               if (slotHour > currentHour) {
//                 return true;
//               }
//               if (slotHour === currentHour) {
//                 return slotMinute >= currentMinute;
//               }
//               return false;
//             });
//           } else {
//             this.availableTimes = times;
//           }

//           this.selectedRadioTime = ''; 
//           console.log('Horários disponíveis (filtrados no front):', this.availableTimes);
//         },
//         error: (err) => {
//           console.error('Erro ao buscar horários disponíveis:', err);
//           this.availableTimes = [];
//           this.selectedRadioTime = '';
//           alert('Erro ao buscar horários disponíveis. Verifique o console para detalhes.');
//         }
//       });
//     } else {
//       this.availableTimes = [];
//       this.selectedRadioTime = '';
//     }
//   }

//   selectRow(time: string): void {
//     this.selectedRadioTime = time;
//     console.log('Horário selecionado:', this.selectedRadioTime);
//   }

  

//   agendarHorario(): void {
//     if (!this.selectedRadioTime) {
//       alert('Por favor, selecione um horário disponível para agendar.');
//       return;
//     }

//     // Esta verificação agora está no lugar certo.
//     if (!this.servicoId) {
//       alert('Erro: Não foi possível identificar o serviço para agendamento.');
//       return;
//     }

//     const agendamentoData = {
//       usuarioId: this.fictitiousUsuarioId,
//       servicoId: this.servicoId, // Usa o ID real vindo da rota
//       atendenteId: this.fictitiousAtendenteId,
//       dataHora: this.selectedRadioTime
//     };

//     console.log('Tentando agendar:', agendamentoData);

//     this.agendamentoApiService.salvarAgendamento(agendamentoData).subscribe({
//       next: (response) => {
//         alert('Agendamento realizado com sucesso!');
//         console.log('Resposta do agendamento:', response);
//         this.onDateChange();
//         this.selectedRadioTime = ''; 
//       },
//       error: (error) => {
//         console.error('Erro ao agendar:', error);
//         let errorMessage = 'Erro ao agendar. Tente novamente.';
//         if (error.error && error.error.message) {
//           errorMessage = `Erro ao agendar: ${error.error.message}`;
//         }
//         alert(errorMessage);
//       }
//     });
//   }


//   getFormattedDate(dateTimeString: string): string {
//     const date = new Date(dateTimeString);
//     return date.toLocaleDateString('pt-BR');
//   }


//   getFormattedTime(dateTimeString: string): string {
//     const date = new Date(dateTimeString);
//     return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
//   }
// }
