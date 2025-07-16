// // src/app/pages/triagens/triagens-funcionario.component.ts

// import { Component, OnInit, OnDestroy }            from '@angular/core';
// import { CommonModule }                 from '@angular/common';
// import { Triagem, TriagemApiService}      from '../../services/triagem-api.service';
// import { NavbarComponent }              from '../../components/navbar/navbar.component';


// @Component({
//   selector: 'app-triagens-funcionario',
//   standalone: true,
//   imports: [CommonModule, NavbarComponent],
//   templateUrl: './triagens-funcionario.component.html',
//   styleUrls: ['./triagens-funcionario.component.scss']
// })
// export class TriagensFuncionarioComponent implements OnInit {
//   triagens: Triagem[] = [];
//   isLoading = false;
//   errorMsg: string | null = null;

//   constructor(private triagemService: TriagemApiService) {}

//   ngOnInit(): void {
//     // 1. Marca o body para tema de funcionário
//     document.body.classList.add('menu-funcionario-bg');

//     this.isLoading = true;
//     this.triagemService.getAll().subscribe({
//       next: (list: Triagem[]) => {
//         this.triagens = list;
//         this.isLoading = false;
//       },
//       error: (err: any) => {
//         console.error('Erro ao carregar triagens', err);
//         this.errorMsg = 'Falha ao carregar triagens. Tente novamente.';
//         this.isLoading = false;
//       }
//     });
//   }

//   ngOnDestroy(): void{
//     // Remove a classe ao sair da tela
//     document.body.classList.remove('menu-funcionario-bg');
//   }
// }

// src/app/pages/triagens/triagens-funcionario.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                  from '@angular/common';
import { Triagem, TriagemApiService }    from '../../services/triagem-api.service';
import { NavbarComponent }               from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-triagens-funcionario',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './triagens-funcionario.component.html',
  styleUrls: ['./triagens-funcionario.component.scss']
})
export class TriagensFuncionarioComponent implements OnInit, OnDestroy {
  triagens: Triagem[]      = [];
  isLoading = false;
  isChamando = false;
  errorMsg: string | null  = null;

  constructor(private triagemService: TriagemApiService) {}

  ngOnInit(): void {
    document.body.classList.add('menu-funcionario-bg');
    this.loadTriagens();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('menu-funcionario-bg');
  }

  /** Carrega todas as triagens do back-end */
  private loadTriagens(): void {
    this.isLoading = true;
    this.triagemService.getAll().subscribe({
      next: list => {
        this.triagens = list;
        this.isLoading = false;
      },
      error: err => {
        console.error('Erro ao carregar triagens', err);
        this.errorMsg = 'Falha ao carregar triagens. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  /** Chama o próximo cliente AGUARDANDO */
  onChamarProximo(): void {
    this.isChamando = true;
    this.triagemService.buscarProximaTriagem().subscribe({
      next: updated => {
        // 1. Atualiza em memória o status daquele item
        const idx = this.triagens.findIndex(t => t.id === updated.id);
        if (idx > -1) {
          this.triagens[idx] = updated;
        }
        // 2. (Opcional) Recarrega toda a lista
        // this.loadTriagens();
        this.isChamando = false;
      },
      error: err => {
        console.error('Erro ao chamar próximo cliente', err);
        alert('Não foi possível chamar o próximo. Tente novamente.');
        this.isChamando = false;
      }
    });
  }
}
