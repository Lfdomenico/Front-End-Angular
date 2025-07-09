// src/app/pages/menu-cliente/menu-cliente.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

interface Setor {
  nome: string;
  descricao: string;
  iconClass: string;
}

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.scss']
})
export class MenuClienteComponent {
  setores: Setor[] = [
    {
      nome: 'Informações Gerais',
      descricao: 'Dúvidas sobre produtos, taxas, horários de funcionamento, etc.',
      iconClass: 'fa fa-info-circle'
    },
    {
      nome: 'Abertura/Encerramento de Conta',
      descricao: 'Cadastro de novos clientes e procedimentos de encerramento.',
      iconClass: 'fa fa-university'
    },
    {
      nome: 'Bloqueio/Desbloqueio de Cartão',
      descricao: 'Bloqueio por perda/roubo ou desbloqueio de cartão.',
      iconClass: 'fa fa-credit-card'
    },
    {
      nome: 'Análise de Fraude',
      descricao: 'Investigação de transações não reconhecidas.',
      iconClass: 'fa fa-search'
    },
    {
      nome: 'Renegociação de Dívidas',
      descricao: 'Negociação de débitos, parcelamentos e descontos.',
      iconClass: 'fa fa-money-bill-alt'
    },
    {
      nome: 'Suporte ao App/Internet Banking',
      descricao: 'Ajuda com acesso, funcionalidades ou erros no sistema.',
      iconClass: 'fa fa-headset'
    }
  ];
}
