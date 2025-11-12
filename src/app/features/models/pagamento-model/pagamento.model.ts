export interface Pagamento {
  id: string;
  reservaId: string;
  valor: number;
  metodoPagamento: MetodoPagamento;
  status: PagamentoStatus;
  dataPagamento: Date;
  numeroTransacao?: string;

}

export enum MetodoPagamento {
  CartaoCredito = 'CartaoCredito',
  CartaoDebito = 'CartaoDebito',
  Transferencia = 'Transferencia',
  Express = 'Express',
  Multicaixa = 'Multicaixa'
}

export enum PagamentoStatus {
  Pendente = 'Pendente',
  Processando = 'Processando',
  Aprovado = 'Aprovado',
  Rejeitado = 'Rejeitado',
  Estornado = 'Estornado'
}


export interface ProcessarPagamentoDto {
  reservaId: string;
  metodoPagamento: MetodoPagamento;
  
}
