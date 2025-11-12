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
 getAll(): Observable<Destino[]> {
   return this.http.get<Destino[]>(this.apiUrl);
 }
 getById(id: string): Observable<Destino> { // Mudado de number para string
   return this.http.get<Destino>(`${this.apiUrl}/${id}`);
 }
 create(destino: DestinoCreateDto): Observable<Destino> {
   return this.http.post<Destino>(this.apiUrl, destino);
 }
 update(id: string, destino: DestinoUpdateDto): Observable<Destino> { // Mudado de number para string
   return this.http.put<Destino>(`${this.apiUrl}/${id}`, destino);
 }
 delete(id: string): Observable<void> { // Mudado de number para string
   return this.http.delete<void>(`${this.apiUrl}/${id}`);
 }
}

