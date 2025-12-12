import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { 
  Pagamento, 
  CriarPagamentoDto, 
  ResultadoPagamentoDto,
  PagamentoComReservaDto,
  ConsultarStatusDto,
  AtualizarStatusDto
} from '../../features/models/pagamento-model/pagamento.model';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = `${environment.apiUrl}/api/Pagamentos`;

  constructor(private http: HttpClient) {}

  // Processar novo pagamento
  processarPagamento(dados: CriarPagamentoDto): Observable<ResultadoPagamentoDto> {
    return this.http.post<ResultadoPagamentoDto>(this.apiUrl, dados);
  }

  // Obter pagamento por ID
  obterPagamento(id: string): Observable<PagamentoComReservaDto> {
    return this.http.get<PagamentoComReservaDto>(`${this.apiUrl}/${id}`);
  }

  // Obter todos os pagamentos (Admin)
  obterTodosPagamentos(): Observable<PagamentoComReservaDto[]> {
    return this.http.get<PagamentoComReservaDto[]>(this.apiUrl);
  }

  // Meus pagamentos (usuário autenticado)
  meusPagamentos(): Observable<PagamentoComReservaDto[]> {
    return this.http.get<PagamentoComReservaDto[]>(`${this.apiUrl}/meus-pagamentos`);
  }

  // Pagamentos por reserva
  obterPagamentosPorReserva(reservaId: string): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.apiUrl}/reserva/${reservaId}`);
  }

  // Consultar status do pagamento
  consultarStatus(id: string): Observable<ConsultarStatusDto> {
    return this.http.get<ConsultarStatusDto>(`${this.apiUrl}/status/${id}`);
  }

  // Atualizar status do pagamento
  atualizarStatus(id: string, dados: AtualizarStatusDto): Observable<ResultadoPagamentoDto> {
    return this.http.put<ResultadoPagamentoDto>(`${this.apiUrl}/${id}/status`, dados);
  }

  // Listar pagamentos por status
  obterPorStatus(status: string): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.apiUrl}/status/${status}/listar`);
  }

  // Cancelar pagamento
  cancelarPagamento(id: string): Observable<ResultadoPagamentoDto> {
    return this.http.post<ResultadoPagamentoDto>(`${this.apiUrl}/${id}/cancelar`, {});
  }

  // Estornar pagamento
  estornarPagamento(id: string): Observable<ResultadoPagamentoDto> {
    return this.http.post<ResultadoPagamentoDto>(`${this.apiUrl}/${id}/estornar`, {});
  }

  // Confirmar pagamento
  confirmarPagamento(id: string): Observable<ResultadoPagamentoDto> {
    return this.http.post<ResultadoPagamentoDto>(`${this.apiUrl}/${id}/confirmar`, {});
  }
}
