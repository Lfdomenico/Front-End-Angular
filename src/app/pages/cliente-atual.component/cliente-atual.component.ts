import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { TriagemCompleta, StatusTriagemFrontend } from '../../services/triagem.interface'; 
import { NavbarComponent } from '../../components/navbar/navbar.component'; 

@Component({
  selector: 'app-cliente-atual',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent  
  ],
  templateUrl: './cliente-atual.component.html',
  styleUrls: ['./cliente-atual.component.scss'] 
})
export class ClienteAtualComponent implements OnInit {
  triagem: TriagemCompleta | null = null; 

  constructor(
    private router: Router 
  ) { }

  ngOnInit(): void {
    // **DADOS FICTÍCIOS PARA TESTE NO FRONTEND**
    this.triagem = {
      id: 'fictitious-triagem-id-12345',
      clienteId: 'fictitious-cliente-id-abcde',
      servicoId: 'fictitious-servico-id-xyzab',
      nomeClienteSnapshot: 'Maria da Silva (Fictício)',
      nomeServicoSnapshot: 'Abertura de Conta Corrente',
      status: StatusTriagemFrontend.EM_ATENDIMENTO, 
      horarioSolicitacao: '2025-07-16T10:00:00', 
      horarioEstimadoAtendimento: '2025-07-16T10:15:00', 
      tempoEstimadoMinutos: 15,
      prioridade: 1,
      documentosPendentes: [
        { 
          id: 'doc-id-1', 
          documentoCatalogoId: 'cat-doc-1', 
          nomeDocumentoSnapshot: 'Documento de Identidade (RG)', 
          status: 'PENDENTE', 
          observacao: 'Aguardando envio da cópia digitalizada.', 
          urlDocumento: null 
        },
        { 
          id: 'doc-id-2', 
          documentoCatalogoId: 'cat-doc-2', 
          nomeDocumentoSnapshot: 'Comprovante de Residência', 
          status: 'ENVIADO', 
          observacao: 'Verificar validade.', 
          urlDocumento: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' 
        }
      ]
    };

    console.log('Dados de triagem fictícios carregados:', this.triagem);
  }

  retornar(): void {
    this.router.navigate(['/menu-funcionario']); 
  }

  getFormattedDateTime(dateTimeString: string | null): string {
    if (!dateTimeString) return 'N/A';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('pt-BR') + ' ' + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}