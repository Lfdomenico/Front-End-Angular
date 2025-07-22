import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';

import { ChartData, ChartOptions, Chart, registerables } from 'chart.js';
import { AnalyticsService , ContagemPorItem} from '../../services/analytics.service';
import { BaseChartDirective } from 'ng2-charts'; // Necessário para standalone

@Component({
  selector: 'app-dashboard-funcionario',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, BaseChartDirective],
  templateUrl: './dashboard-funcionario.component.html',
  styleUrls: ['./dashboard-funcionario.component.scss']
})
export class DashboardFuncionarioComponent implements OnInit, OnDestroy {

  graficoSelecionado: 'servicos' | 'atendimentosDia' = 'servicos';


public triagemChartData: ChartData<'doughnut'> = { labels: [], datasets: [{ data: [] }] };
  public agendamentoChartData: ChartData<'pie'> = { labels: [], datasets: [{ data: [] }] };
  public chartOptions: ChartOptions = { 
    responsive: true ,
    plugins: {
        legend:
        {
            labels: {
                color: '#f8f9fa'
            }
        }
    }
    
};

  constructor(private analyticsService: AnalyticsService) { Chart.register(...registerables);}
  ngOnInit(): void {
    document.body.classList.add('menu-funcionario-bg');
    this.carregarDadosTriagem();
    this.carregarDadosAgendamento();
  }

  ngOnDestroy(): void {
    document.body.classList.remove('menu-funcionario-bg');
  }

  private carregarDadosTriagem(): void {

    this.analyticsService.getServicosMaisUtilizadosTriagem().subscribe((data: ContagemPorItem[]) => {
      if(data && data.length > 0){
        this.triagemChartData = {
        labels: data.map(item => item.item),
        datasets: [{ 
          data: data.map(item => item.quantidade),
          backgroundColor: [
            'rgba(198, 40, 40, 0.8)', // Vermelho BankFlow
            'rgba(54, 162, 235, 0.8)', // Azul
            'rgba(255, 206, 86, 0.8)', // Amarelo
            'rgba(75, 192, 192, 0.8)',  // Verde-água
            'rgba(153, 102, 255, 0.8)' // Roxo
          ],
          borderColor: '#192332',
          borderWidth: 2
        }]
      };
    }
    });
  }

  private carregarDadosAgendamento(): void {
    this.analyticsService.getServicosMaisUtilizadosAgendamento().subscribe((data: ContagemPorItem[]) => {
        if (data && data.length > 0) {
        this.agendamentoChartData = {
        labels: data.map(item => item.item),
        datasets: [{ data: data.map(item => item.quantidade),
            backgroundColor: [
            'rgba(198, 40, 40, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)'
          ],
          borderColor: '#192332'
        }]
      };
    }
    });
  }
}