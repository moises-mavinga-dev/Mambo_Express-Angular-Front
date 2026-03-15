import { Routes } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home/home.component';
import { UsuarioTableComponent } from './features/components/usuario-table/usuario-table.component';
import { authGuard, roleGuard } from './core/guads/auth.guard';
import { LoginComponent } from './features/components/login/login.component';
import { CriarReservaComponent } from './features/components/criar-reserva/criar-reserva.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { DashboardComponent } from './features/admin/components/dashboard/dashboard.component';

export const routes: Routes = [
  // ==================== ROTAS PÚBLICAS (COM LAYOUT PRINCIPAL) ====================
  {
    path: '',
    component: MainLayoutComponent,  // ✅ Layout com navbar e footer
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./features/home/home/home.component')
          .then(m => m.HomeComponent)
      },
      {
        path: 'destinos',
        loadComponent: () => import('./features/components/destinos/destino-list/destino-list.component')
          .then(m => m.DestinoListComponent)
      },
      {
        path: 'destinocard',
        loadComponent: () => import('./features/components/destinos/destino-card/destino-card.component')
          .then(m => m.DestinoCardComponent)
      },
      {
        path: 'pacotescard',
        loadComponent: () => import('./features/components/pacotes/pacote-card/pacote-card.component')
          .then(m => m.PacoteCardComponent)
      },
      {
        path: 'perfil',
        loadComponent: () => import('./features/components/perfil/perfil.component')
          .then(m => m.PerfilComponent)
      },
      { 
        path: 'reserva/criar', 
        component: CriarReservaComponent 
      },
      { 
        path: 'reserva/criar/:id', 
        component: CriarReservaComponent 
      },
      {
        path: 'minhas-reservas',
        canActivate: [authGuard],
        loadComponent: () => import('./features/components/minha-reserva/minha-reserva.component')
          .then(m => m.MinhaReservaComponent)
      },
      {
        path: 'minhas-reservas/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/components/minha-reserva/minha-reserva.component')
          .then(m => m.MinhaReservaComponent)
      },
      {
        path: 'detalhe-reservas/:id',
        loadComponent: () => import('./features/components/reservas/reserva-detalhe/reserva-detalhe.component')
          .then(m => m.ReservaDetalheComponent)
      },
      
      // ==================== ROTAS DE PAGAMENTO ====================
      {
        path: 'pagamento/:id',
        loadComponent: () => import('./features/components/checkout/checkout.component')
          .then(m => m.CheckoutComponent)
      },
      
      {
        path: 'usuariotable',
        loadComponent: () => import('./features/components/usuario-table/usuario-table.component')
          .then(m => m.UsuarioTableComponent)
      },
      
    ]
  },
  
  // ==================== ROTAS ADMIN (COM LAYOUT ADMIN) ====================
  {
    path: 'admin',
    component: AdminLayoutComponent,  // ✅ Layout administrativo
    canActivate: [authGuard, roleGuard(['Admin'])],  // ✅ Protegido por autenticação e role
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { title: 'Dashboard' }
      },
       /* {
        path: 'destinos',
        loadComponent: () => 
          import('./features/admin/components/gerenciar-destinos/gerenciar-destinos.component')
            .then(m => m.GerenciarDestinosComponent),
        data: { title: 'Gerenciar Destinos' }
      },
      {
        path: 'pacotes',
        loadComponent: () => 
          import('./features/admin/components/gerenciar-pacotes/gerenciar-pacotes.component')
            .then(m => m.GerenciarPacotesComponent),
        data: { title: 'Gerenciar Pacotes' }
      },*/
      {
        path: 'reservas',
        loadComponent: () => 
          import('./features/admin/components/gerenciar-reservas/gerenciar-reservas.component')
            .then(m => m.GerenciarReservasComponent),
        data: { title: 'Gerenciar Reservas' }
      },
     /* {
        path: 'usuarios',
        loadComponent: () => 
          import('./features/admin/components/gerenciar-usuarios/gerenciar-usuarios.component')
            .then(m => m.GerenciarUsuariosComponent),
        data: { title: 'Gerenciar Usuários' }
      },
      {
        path: 'relatorios',
        loadComponent: () => 
          import('./features/admin/components/relatorios/relatorios.component')
            .then(m => m.RelatoriosComponent),
        data: { title: 'Relatórios' }
      },
      {
        path: 'configuracoes',
        loadComponent: () => 
          import('./features/admin/components/configuracoes/configuracoes.component')
            .then(m => m.ConfiguracoesComponent),
        data: { title: 'Configurações' }
      },
      {
        path: 'perfil',
        loadComponent: () => 
          import('./features/admin/components/perfil/perfil.component')
            .then(m => m.PerfilComponent),
        data: { title: 'Meu Perfil' }
      }*/
    ]
  },
  
  // ==================== ROTAS DE AUTENTICAÇÃO (SEM LAYOUT) ====================
  {
    path: 'registro',
    loadComponent: () => import('./features/components/registro/registro.component')
      .then(m => m.RegistroComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/components/login/login.component')
      .then(m => m.LoginComponent)
  },
  
  // ==================== ROTA 404 ====================
  {
    path: '**',
    redirectTo: 'home'
  }
];