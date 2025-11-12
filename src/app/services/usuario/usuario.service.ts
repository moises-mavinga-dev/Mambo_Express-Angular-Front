import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { 
  ApiResponse, 
  AtualizarUsuarioDto, 
  UsuarioResponseDto,
  AlterarSenhaDto 
} from '../../features/models/usuarios.model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/api/Usuario`;

  constructor(private http: HttpClient) {}

  // ============================================
  // ADMIN - GESTÃO DE USUÁRIOS
  // ============================================
  
  obterTodosUsuarios(): Observable<UsuarioResponseDto[]> {
    return this.http.get<UsuarioResponseDto[]>(this.apiUrl);
  }

  obterUsuarioPorId(id: string): Observable<UsuarioResponseDto> {
    return this.http.get<UsuarioResponseDto>(`${this.apiUrl}/${id}`);
  }

  atualizarUsuario(id: string, dados: AtualizarUsuarioDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/${id}`, dados);
  }

  deletarUsuario(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}/${id}`);
  }

  // ============================================
  // ROLES
  // ============================================
  
  atribuirRole(id: string, role: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/${id}/atribuir-role`, 
      JSON.stringify(role),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  removerRole(id: string, role: string): Observable<ApiResponse> {
    return this.http.request<ApiResponse>(
      'DELETE',
      `${this.apiUrl}/${id}/remover-role`,
      { 
        body: JSON.stringify(role),
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  // ============================================
  // LISTAGENS POR ROLE
  // ============================================
  
  obterClientes(): Observable<UsuarioResponseDto[]> {
    return this.http.get<UsuarioResponseDto[]>(`${this.apiUrl}/clientes`);
  }

  obterAgentes(): Observable<UsuarioResponseDto[]> {
    return this.http.get<UsuarioResponseDto[]>(`${this.apiUrl}/agentes`);
  }

  obterAdministradores(): Observable<UsuarioResponseDto[]> {
    return this.http.get<UsuarioResponseDto[]>(`${this.apiUrl}/administradores`);
  }

  // ============================================
  // ✅ PERFIL - ENDPOINTS CORRETOS
  // ============================================
  
  // GET /api/Usuario/perfil
  getMeuPerfil(): Observable<UsuarioResponseDto> {
    return this.http.get<UsuarioResponseDto>(`${this.apiUrl}/perfil`);
  }

  // PUT /api/Usuario/perfil - RETORNA USUÁRIO ATUALIZADO
  atualizarMeuPerfil(dados: AtualizarUsuarioDto): Observable<UsuarioResponseDto> {
    return this.http.put<UsuarioResponseDto>(`${this.apiUrl}/perfil`, dados);
  }

  // ✅ PUT /api/Usuario/alterar-senha - ACEITA DTO COMPLETO
  alterarSenha(dados: AlterarSenhaDto): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}/alterar-senha`, dados);
  }
}
