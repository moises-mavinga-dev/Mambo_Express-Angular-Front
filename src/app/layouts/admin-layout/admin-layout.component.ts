import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-layout',
  imports: [CommonModule, RouterLink, RouterOutlet],
  templateUrl: './admin-layout.component.html',
  styleUrl: './admin-layout.component.css'
})
export class AdminLayoutComponent {



   sidebarOpen = true;
  userMenuOpen = false;
  
  adminName = 'Administrador';
  adminEmail = 'admin@viajarangola.ao';

  menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      route: '/admin/dashboard',
      active: true
    },
    {
      icon: '🌍',
      label: 'Destinos',
      route: '/admin/destinos',
      active: false
    },
    {
      icon: '📦',
      label: 'Pacotes',
      route: '/admin/pacotes',
      active: false
    },
    {
      icon: '📋',
      label: 'Reservas',
      route: '/admin/reservas',
      active: false
    },
    {
      icon: '👥',
      label: 'Usuários',
      route: '/admin/usuarios',
      active: false
    },
    {
      icon: '📈',
      label: 'Relatórios',
      route: '/admin/relatorios',
      active: false
    },
    {
      icon: '⚙️',
      label: 'Configurações',
      route: '/admin/configuracoes',
      active: false
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.updateActiveMenu();
  }

  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
  }

  updateActiveMenu(): void {
    const currentRoute = this.router.url;
    this.menuItems.forEach(item => {
      item.active = currentRoute.startsWith(item.route);
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
   clouse(): void {
    this.userMenuOpen = false;
    this.authService.logout();
  }

  goToProfile(): void {
    this.router.navigate(['/admin/perfil']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

}
