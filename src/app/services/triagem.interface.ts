import { DocumentoPendente } from './agendamento-api.service'; 

export enum StatusTriagemFrontend {
  PENDENTE = 'PENDENTE',
  EM_ATENDIMENTO = 'EM_ATENDIMENTO',
  CONCLUIDA = 'CONCLUIDA',
  CANCELADA = 'CANCELADA'
}

export interface TriagemCompleta {
  id: string;
  clienteId: string;
  servicoId: string;
  nomeClienteSnapshot: string;
  nomeServicoSnapshot: string;
  status: StatusTriagemFrontend; 
  horarioSolicitacao: string; 
  horarioEstimadoAtendimento: string | null; 
  tempoEstimadoMinutos: number;
  prioridade: number;
  documentosPendentes: DocumentoPendente[]; 
}