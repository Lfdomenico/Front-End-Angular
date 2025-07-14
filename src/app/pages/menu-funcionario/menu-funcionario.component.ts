import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Tarefa, TarefaService } from '../../services/tarefa.service';

@Component({
  selector: 'app-menu-funcionario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu-funcionario.component.html',
  styleUrls: ['./menu-funcionario.component.scss']
})
export class MenuFuncionarioComponent implements OnInit { 

  tarefas: Tarefa[] = [];

  constructor(private tarefaService: TarefaService) { }

  ngOnInit(): void {
    this.carregarTarefas();
    document.body.classList.add('menu-funcionario-bg');
  }

  ngOnDestroy(): void{
    document.body.classList.remove('menu-funcionario-bg');
  }

  carregarTarefas(): void {
    this.tarefaService.getTarefas().subscribe({
      next: (dados) => {
        this.tarefas = dados;
        console.log('Tarefas carregadas com sucesso!', dados);
      },
      error: (err) => {
        console.error('Erro ao carregar tarefas:', err);
      }
    });
  }
}