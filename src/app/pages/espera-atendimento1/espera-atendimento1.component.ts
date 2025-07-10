// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { NavbarComponent } from '../../components/navbar/navbar.component';

// @Component({
//   selector: 'app-espera-atendimento',
//   standalone: true,
//   imports: [CommonModule, NavbarComponent], // Importa o que o componente precisa
//   templateUrl: './espera-atendimento1.component.html',
//   styleUrls: ['./espera-atendimento1.component.scss']
// })
// export class EsperaAtendimentoComponent implements OnInit, OnDestroy {

//   public setorSelecionado: string = '';
//   public tempoRestante: number = 120; // Tempo inicial em segundos (2 minutos)
//   public displayTempo: string = '02:00';
//   private timerInterval: any;

//   constructor(private route: ActivatedRoute) {}

//   ngOnInit(): void {
//     this.setorSelecionado = this.route.snapshot.paramMap.get('setorNome') || 'Serviço Solicitado';
//     this.startTimer();
//   }

//   ngOnDestroy(): void {
//     if (this.timerInterval) {
//       clearInterval(this.timerInterval);
//     }
//   }

//   private startTimer(): void {
//     this.timerInterval = setInterval(() => {
//       if (this.tempoRestante > 0) {
//         this.tempoRestante--;
//         this.formatTime();
//       } else {
//         clearInterval(this.timerInterval);
//         this.displayTempo = "Sua vez!";
//       }
//     }, 1000);
//   }

//   private formatTime(): void {
//     const minutos: number = Math.floor(this.tempoRestante / 60);
//     const segundos: number = this.tempoRestante % 60;

//     const displayMinutos = minutos < 10 ? '0' + minutos : minutos.toString();
//     const displaySegundos = segundos < 10 ? '0' + segundos : segundos.toString();

//     this.displayTempo = `${displayMinutos}:${displaySegundos}`;
//   }
// }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-espera-atendimento',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './espera-atendimento1.component.html',
  styleUrls: ['./espera-atendimento1.component.scss']
})
export class EsperaAtendimentoComponent implements OnInit, OnDestroy {

  public setorSelecionado: string = '';
  // O tempo agora vem da rota, com um valor padrão de 120
  public tempoRestante: number = 120; 
  public displayTempo: string = '02:00';
  private timerInterval: any;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Captura o nome do setor do parâmetro da rota
    this.setorSelecionado = this.route.snapshot.paramMap.get('setorNome') || 'Serviço Solicitado';
    
    // Captura o tempo do query parameter
    const tempoDaRota = this.route.snapshot.queryParamMap.get('tempo');
    if (tempoDaRota) {
      this.tempoRestante = +tempoDaRota; // O '+' converte a string para número
    }
    
    this.formatTime(); // Formata o tempo inicial antes de começar o timer
    this.startTimer();
  }

  // ... o resto do seu código (ngOnDestroy, startTimer, formatTime) permanece o mesmo ...
  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  private startTimer(): void {
    this.timerInterval = setInterval(() => {
      if (this.tempoRestante > 0) {
        this.tempoRestante--;
        this.formatTime();
      } else {
        clearInterval(this.timerInterval);
        this.displayTempo = "Sua vez!";
      }
    }, 1000);
  }

  private formatTime(): void {
    const minutos: number = Math.floor(this.tempoRestante / 60);
    const segundos: number = this.tempoRestante % 60;

    const displayMinutos = minutos < 10 ? '0' + minutos : minutos.toString();
    const displaySegundos = segundos < 10 ? '0' + segundos : segundos.toString();

    this.displayTempo = `${displayMinutos}:${displaySegundos}`;
  }
}