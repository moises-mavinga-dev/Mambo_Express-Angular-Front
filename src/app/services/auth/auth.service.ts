import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment.development';
import { LoginDto, LoginResponse, RegistroDto, UsuarioResponseDto } from '../../features/models/usuarios.model/usuario.model';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/api/Usuario`;
  private currentUserSubject = new BehaviorSubject<UsuarioResponseDto | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.loadCurrentUser();
  }

  // ============================================
  // REGISTRAR (POST /api/Usuario/registrar)
  // ============================================
  registrar(userData: RegistroDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/registrar`, userData)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.usuario);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
        })
      );
  }

  // ============================================
  // LOGIN (POST /api/Usuario/login)
  // ============================================
  login(credentials: LoginDto): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          this.setToken(response.token);
          this.currentUserSubject.next(response.usuario);
          localStorage.setItem('currentUser', JSON.stringify(response.usuario));
        })
      );
  }

  // ============================================
  // LOGOUT (POST /api/Usuario/logout)
  // ============================================
  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {})
      .pipe(
        tap(() => {
          this.clearSession();
          this.router.navigate(['/login']);
        })
      );
  }

  // Logout local (sem chamar API)
  logoutLocal(): void {
    this.clearSession();
    this.router.navigate(['/login']);
  }

  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  // ============================================
  // TOKEN MANAGEMENT
  // ============================================
  private setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      return Date.now() >= exp;
    } catch {
      return true;
    }
  }

  // ============================================
  // CURRENT USER
  // ============================================
  private loadCurrentUser(): void {
    const userJson = localStorage.getItem('currentUser');
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUserSubject.next(user);
      } catch {
        this.clearSession();
      }
    }
  }
  

  getCurrentUser(): UsuarioResponseDto | null {
    return this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.getCurrentUser();
    return user?.roles?.includes(role) || false;
  }

  isAdmin(): boolean {
    return this.hasRole('Admin');
  }

  isAgente(): boolean {
    return this.hasRole('Agente');
  }

  isCliente(): boolean {
    return this.hasRole('Cliente');
  }
}
