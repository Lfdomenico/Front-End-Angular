// // src/app/pages/menu-cliente/menu-cliente.component.ts
// import { Component } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
// // import { RouterLink } from '@angular/router';
// import { Router } from '@angular/router';

// interface Setor {
//   nome: string;
//   descricao: string;
//   iconClass: string;
// }

// @Component({
//   selector: 'app-menu-cliente',
//   standalone: true,
//   imports: [CommonModule, NavbarComponent, RouterLink],
//   templateUrl: './menu-cliente.component.html',
//   styleUrls: ['./menu-cliente.component.scss']
// })
// export class MenuClienteComponent {
//   setores: Setor[] = [
//     {
//       nome: 'Informações Gerais',
//       descricao: 'Dúvidas sobre produtos, taxas, horários de funcionamento, etc.',
//       iconClass: 'fa fa-info-circle'
//     },
//     {
//       nome: 'Abertura/Encerramento de Conta',
//       descricao: 'Cadastro de novos clientes e procedimentos de encerramento.',
//       iconClass: 'fa fa-university'
//     },
//     {
//       nome: 'Bloqueio/Desbloqueio de Cartão',
//       descricao: 'Bloqueio por perda/roubo ou desbloqueio de cartão.',
//       iconClass: 'fa fa-credit-card'
//     },
//     {
//       nome: 'Análise de Fraude',
//       descricao: 'Investigação de transações não reconhecidas.',
//       iconClass: 'fa fa-search'
//     },
//     {
//       nome: 'Renegociação de Dívidas',
//       descricao: 'Negociação de débitos, parcelamentos e descontos.',
//       iconClass: 'fa fa-money-bill-alt'
//     },
//     {
//       nome: 'Suporte ao App/Internet Banking',
//       descricao: 'Ajuda com acesso, funcionalidades ou erros no sistema.',
//       iconClass: 'fa fa-headset'
//     }
//   ];
// } 

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
// 1. IMPORTE O ROUTER PARA NAVEGAÇÃO PROGRAMÁTICA
import { Router } from '@angular/router';

// 2. ATUALIZE A INTERFACE
interface Setor {
  nome: string;
  descricao: string;
  iconClass: string;
  tempo: number; // Tempo em segundos
  rota: string;  // Rota de destino ('/espera' ou '/agendamento')
}

@Component({
  selector: 'app-menu-cliente',
  standalone: true,
  // Remova o RouterLink daqui, pois não será mais usado no template
  imports: [CommonModule, NavbarComponent],
  templateUrl: './menu-cliente.component.html',
  styleUrls: ['./menu-cliente.component.scss']
})
export class MenuClienteComponent {

  // 3. INJETE O ROUTER NO CONSTRUTOR
  constructor(private router: Router) {}

  // 4. ATUALIZE A LISTA DE SETORES COM AS NOVAS REGRAS
  setores: Setor[] = [
    {
      nome: 'Informações Gerais',
      descricao: 'Dúvidas sobre produtos, taxas, horários, etc.',
      iconClass: 'fa fa-info-circle',
      tempo: 300, // 5 minutos
      rota: '/espera'
    },
    {
      nome: 'Abertura e Encerramento de Conta',
      descricao: 'Procedimentos para novos e antigos clientes.',
      iconClass: 'fa fa-university',
      tempo: 1200, // 20 minutos
      rota: '/agendamento'
    },
    {
      nome: 'Bloqueio e Desbloqueio de Cartão',
      descricao: 'Procedimentos de segurança para seu cartão.',
      iconClass: 'fa fa-credit-card',
      tempo: 30, // 5 minutos
      rota: '/espera'
    },
    {
      nome: 'Análise de Fraude',
      descricao: 'Investigação de transações não reconhecidas.',
      iconClass: 'fa fa-search',
      tempo: 1800, // 30 minutos
      rota: '/agendamento'
    },
    {
      nome: 'Renegociação de Dívidas',
      descricao: 'Negociação de débitos, parcelamentos e descontos.',
      iconClass: 'fa fa-money-bill-alt',
      tempo: 300, // 5 minutos
      rota: '/espera'
    },
    {
      nome: 'Suporte ao App/Internet Banking',
      descricao: 'Ajuda com acesso, funcionalidades ou erros no sistema.',
      iconClass: 'fa fa-headset',
      tempo: 300, // 5 minutos
      rota: '/espera'
    }
  ];

  // 5. CRIE UM MÉTODO PARA LIDAR COM O CLIQUE
  selecionarSetor(setor: Setor): void {
    const rotaDestino = [setor.rota, setor.nome];
    const queryParams = { tempo: setor.tempo };

    this.router.navigate(rotaDestino, { queryParams });
  }
}
