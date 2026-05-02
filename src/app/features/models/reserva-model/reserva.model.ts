
import { Destino } from "../destno-model/destino.model";
import { Pacote, PacoteReponseReservaDto, PacoteReservaDto } from "../pacote-model/pacote.model";
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

export interface ReservaDto {
    id: string;                 // Guid → string
  usuarioId: string;
  pacoteId: string;
  pacote: PacoteReponseReservaDto;
   destinoId: string;
  destino: Destino;
  dataReserva: string;        // DateTime → string (ISO)
  dataViagem: string;
  quantidadePessoas: number;
  valorTotal: number;
  statuReserva: string;
  pagamentoConfirmado: boolean;
   
  
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
  nomeCidade: string;
  nomePacote?: string;
  quantidadePessoas:number;
  dataReserva: Date;
  dataViagem: Date;
}

export interface  MinhasReservasDto{
    id: string;
   nomeCidade: string;
// pais: string;
  nomePacote?: string;
quantidadePessoas:number;
valorTotal:number;
  dataReserva: Date;
  dataViagem: Date;
   statuReserva: StatuReserva;
  pagamentoConfirmado:boolean;
}

export interface AtualizarReservaDto {
  dataViagem?: Date;
  statuReserva: StatuReserva;
}

