import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { CriarReservaDto, MinhasReservasDto, Reserva, ReservaDto, ReservaResponseDto } from '../../features/models/reserva-model/reserva.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/api/Reserva`;

  constructor(private http: HttpClient) {}

  // Criar reserva
  criarReserva(dados: CriarReservaDto): Observable<ReservaResponseDto> {
    return this.http.post<ReservaResponseDto>(this.apiUrl, dados);
  }

  // Obter reserva por ID
  obterReserva(id: string): Observable<ReservaDto> {
    return this.http.get<ReservaDto>(`${this.apiUrl}/${id}`);
  }

  // Minhas reservas
  minhasReservas(): Observable<MinhasReservasDto[]> {
    return this.http.get<MinhasReservasDto[]>(`${this.apiUrl}/minhas-reservas`);
  }
    // ✅ OBTER DETALHES DE UMA RESERVA ESPECÍFICA
 /* obterDetalhesReserva(id: string): Observable<MinhasReservasDto> {
    return this.http.get<MinhasReservasDto>(`${this.apiUrl}/minhas/${id}`);
  }*/

  // Cancelar reserva
  cancelarReserva(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Admin: Todas as reservas
  todasReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(this.apiUrl);
  }



  
}
