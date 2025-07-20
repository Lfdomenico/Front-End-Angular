import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AgendamentoApiService, AgendamentoCompleto, AgendamentoRequest } from '../../services/agendamento-api.service';
import { NavbarComponent } from "../../components/navbar/navbar.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agendamento-editar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent
],
  templateUrl: './agendamento-editar.component.html',
  styleUrls: ['./agendamento-editar.component.scss']
})
export class AgendamentoEditarComponent implements OnInit {
  agendamentoId: string | null = null; 
  agendamento: AgendamentoCompleto | null = null; 
  agendamentoEditavel: AgendamentoRequest = { 
    usuarioId: '',
    servicoId: '',
    atendenteId: null,
    dataHora: '',
    observacoes: ''
  };
  
  minDate: string; 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private agendamentoApiService: AgendamentoApiService
  ) {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.agendamentoId = params.get('id');
      if (this.agendamentoId) {
        this.carregarAgendamento(this.agendamentoId);
      } else {
        alert('ID do agendamento não fornecido na URL.');
        this.router.navigate(['/agendamentos-funcionario']); 
      }
    });
  }

  carregarAgendamento(id: string): void {
    this.agendamentoApiService.getAgendamentoPorId(id).subscribe({
      next: (data) => {
        this.agendamento = data;
        
        this.agendamentoEditavel = {
          usuarioId: data.usuarioId,
          servicoId: data.servicoId,
          atendenteId: data.atendenteId,
          dataHora: data.dataHora ? data.dataHora.substring(0, 16) : '', 
          observacoes: data.observacoes 
        };
        console.log('Agendamento carregado para edição:', this.agendamento);
        console.log('Dados do formulário (agendamentoEditavel):', this.agendamentoEditavel);
      },
      error: (err) => {
        console.error('Erro ao carregar agendamento para edição:', err);
        alert('Erro ao carregar agendamento. Verifique o console.');
        this.router.navigate(['/agendamentos-funcionario']);
      }
    });
  }

  salvarAlteracoes(): void {
    if (!this.agendamentoId) {
      // alert('ID do agendamento não encontrado para salvar.');
      Swal.fire({
        icon: 'error',
        title: 'Erro interno',
        text: 'ID do agendamento não encontrado. Não é possível salvar.',
        confirmButtonColor: '#c62828'
      });
      return;
    }

    if (!this.agendamentoEditavel.usuarioId || !this.agendamentoEditavel.servicoId || !this.agendamentoEditavel.dataHora) {
      // alert('Por favor, preencha todos os campos obrigatórios (Usuário, Serviço, Data/Hora).');
      Swal.fire({
        icon: 'warning',
        title: 'Campos Obrigatórios',
        text: 'Por favor, preencha todos os campos obrigatórios (Usuário, Serviço, Data/Hora).',
        confirmButtonColor: '#c62828'
      });
      return;
    }

    this.agendamentoApiService.atualizarAgendamento(this.agendamentoId, this.agendamentoEditavel).subscribe({
      next: (response) => {
        // alert('Agendamento atualizado com sucesso!');
        console.log('Agendamento atualizado:', response);
        Swal.fire({
          icon: 'success',
          title: 'Sucesso!',
          text: 'Agendamento atualizado com sucesso.',
          timer: 2000, // O pop-up fecha sozinho após 2 segundos
          showConfirmButton: false
        }).then(() => {
        this.router.navigate(['/menu-funcionario/agendamentos']); 
      });
    },
      error: (err) => {
        console.error('Erro ao salvar alterações do agendamento:', err);
        let errorMessage = 'Erro ao salvar alterações. Tente novamente.';
        if (err.error && err.error.message) {
          errorMessage = `Erro: ${err.error.message}`;
        } else if (typeof err.error === 'string') { 
          errorMessage = `Erro: ${err.error}`;
        }
        // alert(errorMessage);
        Swal.fire({
          icon: 'error',
          title: 'Falha ao Salvar',
          text: errorMessage,
          confirmButtonColor: '#c62828'
        });
      }
    });
  }

  retornar(): void {
    this.router.navigate(['/menu-funcionario/agendamentos']); 
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