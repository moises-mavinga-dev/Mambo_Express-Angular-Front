import { Injectable } from '@angular/core';
import { Destino, DestinoCreateDto, DestinoUpdateDto } from '../../features/models/destno-model/destino.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {

   private apiUrl = `${environment.apiUrl}/api/Destino`;
 constructor(private http: HttpClient) {}
 obterTodos(): Observable<Destino[]> {
   return this.http.get<Destino[]>(this.apiUrl);
 }
 obterPorId(id: string): Observable<Destino> { // Mudado de number para string
   return this.http.get<Destino>(`${this.apiUrl}/${id}`);
 }
 criar(destino: DestinoCreateDto): Observable<Destino> {
   return this.http.post<Destino>(this.apiUrl, destino);
 }
 atualizar(id: string, destino: DestinoUpdateDto): Observable<Destino> { // Mudado de number para string
   return this.http.put<Destino>(`${this.apiUrl}/${id}`, destino);
 }
 deletar(id: string): Observable<void> { // Mudado de number para string
   return this.http.delete<void>(`${this.apiUrl}/${id}`);
 }
}

