
import { Destino } from "../destno-model/destino.model";
import { Pacote } from "../pacote-model/pacote.model";
import { Pagamento } from "../pagamento-model/pagamento.model";
import { Usuario } from "../usuarios.model/usuario.model";

export interface Reserva {
  id: string;
  usuarioId: string;
  usuario: Usuario;
  pacoteId: string;
  pacote: Pacote;
  destinoId: string;
  destino: Destino;
  quantidadePessoas:number;
  valorTotal:number;
  dataReserva: Date;
  dataViagem: Date;
  status: StatuReserva;
  pagamento?: Pagamento;
  
}
export enum StatuReserva {
  Pendente ,
  Confirmado ,
  Pago ,
  Cancelado ,
  Concluida
}


// ✅ APENAS OS CAMPOS NECESSÁRIOS PARA CRIAR
export interface CriarReservaDto {
  nomeUsuario: string;    // Nome do usuário (não ID)
  nomePacote: string;     // Nome do pacote (não ID)
  nomeCidade: string;     // Nome da cidade (não ID)
  quantidadePessoas: number;
  dataViagem: Date;

}

export interface ReservaResponseDto {
 // usuarioId?: string;
 id: string;
  nomeUsuario?: string;
   nomeDestino: string;
  nomePacote?: string;
  quantidadePessoas:number;
  dataReserva: Date;
  dataViagem: Date;
}

export interface  MinhasReservasDto{
    id: string;
   nomeDestino: string;
// pais: string;
  nomePacote?: string;
quantidadePessoas:number;
valorTotal:number;
  dataReserva: Date;
  dataViagem: Date;
   StatuReserva: StatuReserva;
  pagamentoConfirmado:boolean;
}

export interface AtualizarReservaDto {
  dataViagem?: Date;
  status?: StatuReserva;
}