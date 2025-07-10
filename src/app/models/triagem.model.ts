import { DocumentoPendente } from "./agendamento.model";

export interface Triagem {
  id: string;
  clienteId: string;
  servicoId: string;
  nomeClienteSnapshot: string;
  nomeServicoSnapshot: string; // Adicionado para exibir no select
  status: string; // "AGUARDANDO", "EM_ATENDIMENTO", etc.
  horarioSolicitacao: string;
  horarioEstimadoAtendimento: string;
  tempoEstimadoMinutos: number;
  prioridade: number;
  documentosPendentes: DocumentoPendente[];
}