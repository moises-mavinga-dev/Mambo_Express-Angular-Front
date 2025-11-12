import { Injectable } from "@angular/core";
import { Pagamento, ProcessarPagamentoDto } from "../../features/models/pagamento-model/pagamento.model";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {
  private apiUrl = `${environment.apiUrl}/api/Pagamento`;

  constructor(private http: HttpClient) {}

  processarPagamento(dados: ProcessarPagamentoDto): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.apiUrl}/processar`, dados);
  }

  obterPagamento(id: string): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.apiUrl}/${id}`);
  }

  pagamentoPorReserva(reservaId: string): Observable<Pagamento> {
    return this.http.get<Pagamento>(`${this.apiUrl}/reserva/${reservaId}`);
  }

  meusPagamentos(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(`${this.apiUrl}/meus`);
  }

  // Admin
  todosPagamentos(): Observable<Pagamento[]> {
    return this.http.get<Pagamento[]>(this.apiUrl);
  }

  estornarPagamento(id: string): Observable<Pagamento> {
    return this.http.post<Pagamento>(`${this.apiUrl}/${id}/estornar`, {});
  }
}