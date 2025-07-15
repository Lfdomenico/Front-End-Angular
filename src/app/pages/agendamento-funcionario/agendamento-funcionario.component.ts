import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AgendamentoApiService, AgendamentoCompleto } from '../../services/agendamento-api.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-agendamento-funcionario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
  ],
  templateUrl: './agendamento-funcionario.component.html',
  styleUrls: ['./agendamento-funcionario.component.scss']
})
export class AgendamentoFuncionarioComponent implements OnInit {
  selectedDate: string = '';
  agendamentosDoDia: AgendamentoCompleto[] = [];
  minDate: string;

  constructor(
    private agendamentoApiService: AgendamentoApiService,
    private router: Router // Certifique-se que o Router está injetado
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    if (!this.selectedDate) {
      this.selectedDate = this.minDate;
      this.carregarAgendamentos();
    }
  }

  onDateChange(): void {
    this.carregarAgendamentos();
  }

  carregarAgendamentos(): void {
    if (this.selectedDate) {
      this.agendamentoApiService.getAgendamentosPorData(this.selectedDate).subscribe({
        next: (agendamentos) => {
          this.agendamentosDoDia = agendamentos;
          this.agendamentosDoDia.sort((a, b) => {
            const dateA = new Date(a.dataHora);
            const dateB = new Date(b.dataHora);
            return dateA.getTime() - dateB.getTime();
          });
          console.log('Agendamentos carregados e ordenados para o dia:', this.selectedDate, this.agendamentosDoDia);
        },
        error: (err) => {
          console.error('Erro ao carregar agendamentos para o dia:', this.selectedDate, err);
          this.agendamentosDoDia = [];
          alert('Erro ao carregar agendamentos. Verifique o console para detalhes.');
        }
      });
    } else {
      this.agendamentosDoDia = [];
    }
  }

  /**
   * Lógica para o botão "Alterar".
   * Redireciona para a tela de edição, passando o ID do agendamento como parâmetro de caminho.
   * @param agendamento O agendamento a ser alterado.
   */
  alterarAgendamento(agendamento: AgendamentoCompleto): void {
    console.log('Redirecionando para editar agendamento com ID:', agendamento.id);
    // REMOVA A LINHA ABAIXO:
    // alert(`Funcionalidade de Alterar para agendamento ID: ${agendamento.id} será implementada.`); 
    this.router.navigate(['/menu-funcionario/agendamentos/editar', agendamento.id]); 
  }

  cancelarAgendamento(agendamento: AgendamentoCompleto): void {
    if (confirm(`Tem certeza que deseja cancelar o agendamento de ${agendamento.nomeClienteSnapshot} para ${this.getFormattedTime(agendamento.dataHora)}?`)) {
      this.agendamentoApiService.deletarAgendamento(agendamento.id).subscribe({
        next: () => {
          alert('Agendamento cancelado com sucesso!');
          console.log('Agendamento cancelado:', agendamento.id);
          this.carregarAgendamentos();
        },
        error: (err) => {
          console.error('Erro ao cancelar agendamento:', agendamento.id, err);
          alert('Erro ao cancelar agendamento. Verifique o console para detalhes.');
        }
      });
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