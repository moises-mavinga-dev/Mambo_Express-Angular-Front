export interface Pagamento {
  id: string;
  reservaId: string;
  valor: number;
  metodoPagamento: string;
  dataPagamento: Date;
  status: string;
  statusCodigo: number;
  codigoTransacao: string;
  statusDescricao: string;
}

export interface PagamentoComReservaDto {
  id: string;
  reservaId: string;
  valor: number;
  metodoPagamento: string;
  dataPagamento: Date;
  status: string;
  statusCodigo: number;
  codigoTransacao: string;
  statusDescricao: string;
  reserva?: ReservaResumida;
}

export interface ReservaResumida {
  id: string;
 nomeUsuario: string;  
  dataReserva: Date;
}

export interface CriarPagamentoDto {
  reservaId: string;
  valor: number;
  metodoPagamento: string;
}

export interface ResultadoPagamentoDto {
  sucesso: boolean;
  mensagem: string;
  pagamento?: Pagamento;
}

export interface ConsultarStatusDto {
  pagamentoId: string;
  status: string;
  statusCodigo: number;
  statusDescricao: string;
  codigoTransacao: string;
  dataConsulta: Date;
  podeEstornar: boolean;
  podeConfirmar: boolean;
  podeCancelar: boolean;
}

export interface AtualizarStatusDto {
  novoStatus: string;
  observacao?: string;
}

// Enum de Status (corresponde ao backend)
export enum StatuPagamento {
  Pendente ,
  Processando ,
  Aprovado ,
  Recusado ,
  Cancelado ,
  Estornado ,
  Expirado ,
  AguardandoConfirmacao 
}

// Métodos de pagamento aceitos pela API
export const MetodosPagamentoValidos = {
  Cartao: 'Cartao',
  PIX: 'PIX',
  Boleto: 'Boleto',
  TransferenciaBancaria: 'TransferenciaBancaria'
};