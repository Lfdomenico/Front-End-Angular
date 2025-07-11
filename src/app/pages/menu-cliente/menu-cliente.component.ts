import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Router } from '@angular/router';

interface Setor {
  id: string; // adicao desse campo
  nome: string;
  descricao: string;
  iconClass: string;
  tempoMedioMinutos: number;  // antes tempo médio;
  // rota: string;  
}

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.scss']
})
export class MenuClienteComponent {

  constructor(private router: Router) {}

  // setores: Setor[] = [
  //   {
  //     nome: 'Informações Gerais',
  //     descricao: 'Dúvidas sobre produtos, taxas, horários, etc.',
  //     iconClass: 'fa fa-info-circle',
  //     tempo: 300, 
  //     rota: '/espera'
  //   },
  //   {
  //     nome: 'Abertura e Encerramento de Conta',
  //     descricao: 'Procedimentos para novos e antigos clientes.',
  //     iconClass: 'fa fa-university',
  //     tempo: 1200, 
  //     rota: '/agendamento'
  //   },
  //   {
  //     nome: 'Bloqueio e Desbloqueio de Cartão',
  //     descricao: 'Procedimentos de segurança para seu cartão.',
  //     iconClass: 'fa fa-credit-card',
  //     tempo: 30, 
  //     rota: '/espera'
  //   },
  //   {
  //     nome: 'Análise de Fraude',
  //     descricao: 'Investigação de transações não reconhecidas.',
  //     iconClass: 'fa fa-search',
  //     tempo: 1800,
  //     rota: '/agendamento'
  //   },
  //   {
  //     nome: 'Renegociação de Dívidas',
  //     descricao: 'Negociação de débitos, parcelamentos e descontos.',
  //     iconClass: 'fa fa-money-bill-alt',
  //     tempo: 300,
  //     rota: '/espera'
  //   },
  //   {
  //     nome: 'Suporte ao App/Internet Banking',
  //     descricao: 'Ajuda com acesso, funcionalidades ou erros no sistema.',
  //     iconClass: 'fa fa-headset',
  //     tempo: 300, 
  //     rota: '/espera'
  //   }
  // ];

 
    setores: Setor[] = [
      { id: "0ddad861-48c2-40c2-9df5-5e656cbc0938", nome: "Informações Gerais", descricao: "Dúvidas sobre produtos, taxas, horários de funcionamento, etc.", tempoMedioMinutos: 5, iconClass: 'fa fa-info-circle' },
      { id: "c40e4730-68ca-46aa-bbb9-8cb90800ed6a", nome: "Abertura e Encerramento de Conta", descricao: "Procedimentos para novos e antigos clientes.", tempoMedioMinutos: 20, iconClass: 'fa fa-university' },
      { id: "38147608-1c1d-4d87-9360-7d2aa9516035", nome: "Bloqueio/Desbloqueio de Cartão", descricao: "Cliente solicita o bloqueio por perda/roubo ou desbloqueio de um novo cartão.", tempoMedioMinutos: 15, iconClass: 'fa fa-credit-card' },
      { id: "16ad5e5f-1061-4e09-b290-00bb1cbe3d99", nome: "Análise de Fraude", descricao: "Investigação de transações não reconhecidas pelo cliente.", tempoMedioMinutos: 30, iconClass: 'fa fa-search' },
      { id: "1c371b01-4f4d-49af-998a-aae9aeb388a1", nome: "Renegociação de Dívidas", descricao: "Clientes buscando negociar débitos, parcelamentos ou obter descontos.", tempoMedioMinutos: 25, iconClass: 'fa fa-money-bill-alt' },
      { id: "dd56dcf6-9db8-454b-a919-410d6ca653c4", nome: "Suporte ao App/Internet Banking", descricao: "Ajuda com problemas de acesso, funcionalidades ou erros no sistema digital.", tempoMedioMinutos: 5, iconClass: 'fa fa-headset' }
    ];



  selecionarSetor(setor: Setor): void {

    if (setor.tempoMedioMinutos >= 15) {
      
      
      console.log(`Serviço '${setor.nome}' é demorado (${setor.tempoMedioMinutos} min). Direcionando para agendamento.`);
      this.router.navigate(['/agendamento', setor.id]);

    } else {

     
      console.log(`Serviço '${setor.nome}' é rápido (${setor.tempoMedioMinutos} min). Direcionando para fila de espera.`);
      this.router.navigate(['/espera', setor.id], { 
        queryParams: { 
          tempo: setor.tempoMedioMinutos,
          setorNome: setor.nome
        } 
      });
    }
  }
}