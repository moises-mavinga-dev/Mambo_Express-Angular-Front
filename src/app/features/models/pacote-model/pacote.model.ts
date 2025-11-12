import { Destino } from "../destno-model/destino.model";

export interface Pacote {
  id: string;
  nomePacote: string;
  descricao: string;
  preco: number;
  duracao: number;
  destinoId: string;
  destino:Destino;
  disponivel: boolean;
}

export interface CriarPacoteDto {
  nomePacote: string;
  descricao: string;
  preco: number;
  duracao: number;
  destinoId: string;
}

export interface AtualizarPacoteDto {
  nomePacote?: string;
  descricao?: string;
  preco?: number;
  duracao?: number;
  disponivel?: boolean;
}
