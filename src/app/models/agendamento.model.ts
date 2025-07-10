// src/app/models/agendamento.model.ts

export interface Agendamento {
  id: string;
  usuarioId: string;
  nomeClienteSnapshot: string;
  atendenteId: string | null;
  servicoId: string;
  nomeServicoSnapshot: string;
  dataHora: string; // Formato ISO 8601, ex: "2025-07-09T14:00:00"
  atendidoEm: string | null;
  observacoes: string | null;
  criadoEm: string;
  status: 'AGENDADO' | 'CANCELADO' | 'ATENDIDO' | 'AUSENTE'; // Ou string se houver outros status
  documentosPendentes: DocumentoPendente[]; // Esta lista é crucial
}

export interface DocumentoPendente {
  id: string;
  documentoCatalogoId: string;
  nomeDocumentoSnapshot: string; // Renomeado de nomeDocumento para nomeDocumentoSnapshot
  status: 'PENDENTE' | 'APROVADO' | 'REJEITADO' | 'ENVIADO' | 'AGUARDANDO_VALIDACAO'; // Adicionado 'ENVIADO'
  observacao: string | null;
  urlDocumento: string | null; // Renomeado de urlVisualizacao para urlDocumento
}

// Interface para o tipo de documento do catálogo (se você tiver uma API para isso)
// Se não, mantenha o `any` ou crie uma interface mais simples para nome e id
export interface TipoDocumentoCatalogo {
  id: string; // UUID
  nome: string;
  descricao: string; // O JSON mostra que é sempre uma string
  isObrigatorioPorPadrao: boolean; // ADICIONADO
  isAtivo: boolean; // ADICIONADO
}

