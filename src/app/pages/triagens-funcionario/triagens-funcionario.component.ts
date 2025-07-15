// src/app/pages/triagens/triagens-funcionario.component.ts

import { Component, OnInit, OnDestroy }            from '@angular/core';
import { CommonModule }                 from '@angular/common';
import { Triagem, TriagemApiService}      from '../../services/triagem-api.service';
import { NavbarComponent }              from '../../components/navbar/navbar.component';


@Component({
  selector: 'app-triagens-funcionario',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './triagens-funcionario.component.html',
  styleUrls: ['./triagens-funcionario.component.scss']
})
export class TriagensFuncionarioComponent implements OnInit {
  triagens: Triagem[] = [];
  isLoading = false;
  errorMsg: string | null = null;

  constructor(private triagemService: TriagemApiService) {}

  ngOnInit(): void {
    // 1. Marca o body para tema de funcionário
    document.body.classList.add('menu-funcionario-bg');

    this.isLoading = true;
    this.triagemService.getAll().subscribe({
      next: (list: Triagem[]) => {
        this.triagens = list;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar triagens', err);
        this.errorMsg = 'Falha ao carregar triagens. Tente novamente.';
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy(): void{
    // Remove a classe ao sair da tela
    document.body.classList.remove('menu-funcionario-bg');
  }
}
