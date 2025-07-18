import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TriagemApiService, Triagem } from '../../services/triagem-api.service';


@Component({
  selector: 'app-espera-atendimento',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './espera-atendimento1.component.html',
  styleUrls: ['./espera-atendimento1.component.scss']
})
export class EsperaAtendimentoComponent implements OnInit, OnDestroy {

  public setorSelecionado: string = '';
  public tempoRestante: number = 120; 
  public displayTempo: string = '';
  public isLoading: boolean = true; // MUDANÇA: Adicionamos o estado de loading
  private timerInterval: any;
  private horarioAlvo!: Date;

  constructor(private route: ActivatedRoute,  private router: Router,
    private triagemService: TriagemApiService) {}

  ngOnInit(): void {
    // 4. Lógica principal movida para buscar dados pela rota
    const triagemId = this.route.snapshot.paramMap.get('id');

    if (triagemId) {
      this.carregarDadosDaTriagem(triagemId);
    } else {
      console.error('Nenhum ID de triagem encontrado na URL. Redirecionando...');
      this.router.navigate(['/menu-cliente']);
    }
  }
  
  private carregarDadosDaTriagem(id: string): void {
    this.triagemService.getById(id).subscribe({
      next: (triagem) => {
        this.setorSelecionado = triagem.nomeServicoSnapshot;
        
        if (triagem.horarioEstimadoAtendimento) {
          // 5. Definimos nosso horário-alvo
          this.horarioAlvo = new Date(triagem.horarioEstimadoAtendimento);
          this.startTimer(); // Inicia o contador apenas após receber os dados
        } else {
          this.displayTempo = "Aguarde"; // Fallback caso não haja horário
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Erro ao buscar dados da triagem", err);
        this.displayTempo = "Erro";
      }
    });
  }

  private startTimer(): void {
    // Limpa qualquer timer anterior para segurança
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    // 6. O timer agora recalcula a diferença a cada segundo
    this.timerInterval = setInterval(() => {
      const agora = new Date();
      const segundosRestantes = (this.horarioAlvo.getTime() - agora.getTime()) / 1000;

      if (segundosRestantes > 0) {
        this.formatTime(segundosRestantes);
      } else {
        clearInterval(this.timerInterval);
        this.displayTempo = "Sua vez!";
      }
    }, 1000);
  }

  // 7. O método de formatação agora recebe os segundos como parâmetro
  private formatTime(totalSegundos: number): void {
    const minutos: number = Math.floor(totalSegundos / 60);
    const segundos: number = Math.floor(totalSegundos % 60);

    const displayMinutos = minutos < 10 ? '0' + minutos : minutos.toString();
    const displaySegundos = segundos < 10 ? '0' + segundos : segundos.toString();

    this.displayTempo = `${displayMinutos}:${displaySegundos}`;
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }
}