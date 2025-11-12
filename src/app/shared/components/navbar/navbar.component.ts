import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { AuthService } from '../../../services/auth/auth.service';
import { UsuarioResponseDto } from '../../../features/models/usuarios.model/usuario.model';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  currentUser: UsuarioResponseDto | null = null;
  showMenu = false;
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isLoggedIn = !!user;
      this.isAdmin = this.authService.isAdmin();
    });
  }

  getInitials(): string {
    if (!this.currentUser?.nomeUsuario) return '?';
    const names = this.currentUser.nomeUsuario.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return this.currentUser.nomeUsuario.substring(0, 2).toUpperCase();
  }

  toggleMenu(): void {
    this.showMenu = !this.showMenu;
  }

  logout(): void {
    this.showMenu = false;
    this.authService.logout();
  }
}
