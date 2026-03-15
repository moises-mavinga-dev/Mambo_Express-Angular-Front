import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { 
  CriarReservaDto, 
  MinhasReservasDto, 
  Reserva, 
  ReservaDto, 
  ReservaResponseDto,
  AtualizarReservaDto,
  StatuReserva 
} from '../../features/models/reserva-model/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/api/Reserva`;

  constructor(private http: HttpClient) {}

  // ==================== MÉTODOS DO USUÁRIO ====================

  /**
   * Criar uma nova reserva
   */
  criarReserva(dados: CriarReservaDto): Observable<ReservaResponseDto> {
    return this.http.post<ReservaResponseDto>(this.apiUrl, dados);
  }

  /**
   * Obter detalhes de uma reserva específica por ID
   */
  obterReserva(id: string): Observable<ReservaDto> {
    return this.http.get<ReservaDto>(`${this.apiUrl}/${id}`);
  }

  /**
   * Listar todas as reservas do usuário logado
   */
  minhasReservas(): Observable<MinhasReservasDto[]> {
    return this.http.get<MinhasReservasDto[]>(`${this.apiUrl}/minhas-reservas`);
  }

  /**
   * Cancelar uma reserva
   */
  cancelarReserva(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ==================== MÉTODOS ADMIN ====================

  /**
   * Listar TODAS as reservas (Admin)
   */
  todasReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }

  /**
   * Atualizar status de uma reserva (Admin)
   * Se sua API suportar PATCH ou PUT
   */
  atualizarReserva(id: string, dados: AtualizarReservaDto): Observable<Reserva> {
    return this.http.put<Reserva>(`${this.apiUrl}/${id}`, dados);
  }

  /**
   * Atualizar apenas o status de uma reserva (Admin)
   */
  atualizarStatus(id: string, novoStatus: StatuReserva): Observable<Reserva> {
    return this.http.patch<Reserva>(`${this.apiUrl}/${id}/status`, { 
      statuReserva: novoStatus 
    });
  }

  // ==================== MÉTODOS DE FILTRO E BUSCA ====================

  /**
   * Buscar reservas por status (Admin)
   */
  buscarPorStatus(status: StatuReserva): Observable<Reserva[]> {
    const params = new HttpParams().set('status', status.toString());
    return this.http.get<Reserva[]>(this.apiUrl, { params });
  }

  /**
   * Buscar reservas por usuário (Admin)
   */
  buscarPorUsuario(usuarioId: string): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }

  /**
   * Buscar reservas por período (Admin)
   */
  buscarPorPeriodo(dataInicio: Date, dataFim: Date): Observable<Reserva[]> {
    const params = new HttpParams()
      .set('dataInicio', dataInicio.toISOString())
      .set('dataFim', dataFim.toISOString());
    return this.http.get<Reserva[]>(`${this.apiUrl}/periodo`, { params });
  }

  // ==================== MÉTODOS DE ESTATÍSTICAS ====================

  /**
   * Obter estatísticas das reservas (Admin)
   * Se sua API tiver um endpoint específico
   */
  obterEstatisticas(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/estatisticas`);
  }

  /**
   * Contar reservas por status (Admin)
   */
  contarPorStatus(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/contar-status`);
  }

  // ==================== MÉTODOS AUXILIARES ====================

  /**
   * Verificar se pode cancelar uma reserva
   */
  podeCancelar(reserva: Reserva): boolean {
    const statusPermitidos = [StatuReserva.Pendente, StatuReserva.Confirmado];
    const hoje = new Date();
    const dataViagem = new Date(reserva.dataViagem);
    
    return statusPermitidos.includes(reserva.status) && dataViagem > hoje;
  }

  /**
   * Verificar se pode pagar uma reserva
   */
  podePagar(reserva: Reserva): boolean {
    return reserva.status === StatuReserva.Pendente || 
           reserva.status === StatuReserva.Confirmado;
  }

  /**
   * Calcular total de receita de um array de reservas
   */
  calcularReceita(reservas: Reserva[]): number {
    return reservas
      .filter(r => r.status === StatuReserva.Pago || r.status === StatuReserva.Concluida)
      .reduce((total, r) => total + r.valorTotal, 0);
  }

  /**
   * Obter reservas pendentes de um array
   */
  filtrarPendentes(reservas: Reserva[]): Reserva[] {
    return reservas.filter(r => r.status === StatuReserva.Pendente);
  }

  /**
   * Ordenar reservas por data (mais recente primeiro)
   */
  ordenarPorDataRecente(reservas: Reserva[]): Reserva[] {
    return [...reservas].sort((a, b) => {
      const dataA = new Date(a.dataReserva).getTime();
      const dataB = new Date(b.dataReserva).getTime();
      return dataB - dataA;
    });
  }

  /**
   * Contar destinos únicos
   */
  contarDestinosUnicos(reservas: Reserva[]): number {
    const destinosUnicos = new Set(reservas.map(r => r.destinoId));
    return destinosUnicos.size;
  }

  /**
   * Contar pacotes únicos
   */
  contarPacotesUnicos(reservas: Reserva[]): number {
    const pacotesUnicos = new Set(reservas.map(r => r.pacoteId));
    return pacotesUnicos.size;
  }

  /**
   * Contar usuários únicos
   */
  contarUsuariosUnicos(reservas: Reserva[]): number {
    const usuariosUnicos = new Set(reservas.map(r => r.usuarioId));
    return usuariosUnicos.size;
  }
}