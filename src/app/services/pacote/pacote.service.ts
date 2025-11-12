import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { AtualizarPacoteDto, CriarPacoteDto, Pacote } from '../../features/models/pacote-model/pacote.model';


@Injectable({
  providedIn: 'root'
})
export class PacoteService {
  private apiUrl = `${environment.apiUrl}/api/Pacote`;

  constructor(private http: HttpClient) {}

  // ✅ Método que estava faltando
  obterPorId(id: string): Observable<Pacote> {
    return this.http.get<Pacote>(`${this.apiUrl}/${id}`);
  }

  obterTodos(): Observable<Pacote[]> {
    return this.http.get<Pacote[]>(this.apiUrl);
  }

  obterPorDestino(destinoId: string): Observable<Pacote[]> {
    return this.http.get<Pacote[]>(`${this.apiUrl}/destino/${destinoId}`);
  }

  criar(dados: CriarPacoteDto): Observable<Pacote> {
    return this.http.post<Pacote>(this.apiUrl, dados);
  }

  atualizar(id: string, dados: AtualizarPacoteDto): Observable<Pacote> {
    return this.http.put<Pacote>(`${this.apiUrl}/${id}`, dados);
  }

  deletar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}