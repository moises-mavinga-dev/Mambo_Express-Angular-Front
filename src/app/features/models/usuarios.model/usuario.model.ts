
export interface Usuario{
  nomeUsuario:string;
  dataCriacao: Date;

}
export interface RegistroDto {
  nomeUsuario: string;
  email: string;
  password: string;
  role: string[];
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface UsuarioResponseDto {
  id: string;
  nomeUsuario: string;
  email: string;
  telefone?: string;
  dataCriacao: Date;
  roles: string[];
  ativo: boolean;
}

export interface AtualizarUsuarioDto {
  nomeUsuario?: string;
  email?: string;
  telefone?: string;
}

export interface AlterarSenhaDto {
  senhaAtual: string;
  novaSenha: string;
  confirmarSenha: string;
}

export interface LoginResponse {
  token: string;
  usuario: UsuarioResponseDto;
  expiration?: Date;
}

export interface ApiResponse<T = any> {
  sucesso: boolean;
  mensagem: string;
  data?: T;
}