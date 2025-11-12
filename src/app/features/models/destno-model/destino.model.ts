// destino.model.ts

import { Pacote } from "../pacote-model/pacote.model";

export interface Destino {
  id : string;
  nomeCidade: string;
  pais: string;
  descricao?: string;
  imagem?: string;
  pacotes: Pacote[];
}

// DTOs para Create e Update
export interface DestinoCreateDto {
  nomeCidade: string;
  pais: string;
  descricao?: string;
  imagem?: string;
}

export interface DestinoUpdateDto {
  nomeCidade: string;
  pais: string;
  descricao?: string;
  imagem?: string;
}