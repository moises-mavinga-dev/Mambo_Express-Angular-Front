import { Routes } from '@angular/router';

import { MatGridListModule } from '@angular/material/grid-list';
import { Component } from '@angular/core';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { HomeComponent } from './features/home/home/home.component';
import { UsuarioTableComponent } from './features/components/usuario-table/usuario-table.component';
import { authGuard, roleGuard } from './core/guads/auth.guard';
import { LoginComponent } from './features/components/login/login.component';
import { CriarReservaComponent } from './features/components/criar-reserva/criar-reserva.component';

export const routes: Routes = [


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
     /*  { path: 'destinos', component: DestinoListComponent },*/
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
        path: 'registro',
        loadComponent: () => import('./features/components/registro/registro.component')
        .then(m => m.RegistroComponent)
      },
      {
       path: 'login',
        loadComponent: () => import('./features/components/login/login.component')
        .then(m => m.LoginComponent)
      },
   
    {
      path: 'perfil',
      loadComponent: () => import('./features/components/perfil/perfil.component')
      .then(m => m.PerfilComponent)
    },
    { path: 'reserva/criar', component: CriarReservaComponent },
{ path: 'reserva/criar/:id', component: CriarReservaComponent } ,
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
 
  // ==================== ROTAS DE PAGAMENTO ====================
  
  // Checkout - Processar Pagamento
  {
    path: 'checkout/:id',
    loadComponent: () => import('./features/components/checkout/checkout.component').then(m => m.CheckoutComponent),
    
    //data: { title: 'Finalizar Pagamento' }
  },
 
 {
   path: 'checkout',
   loadComponent: () => import('./features/components/checkout/checkout.component').then(m => m.CheckoutComponent),
   
 },
 
   

     {
    path: 'usuariotable',
    loadComponent: () => import('./features/components/usuario-table/usuario-table.component')
    .then(m => m.UsuarioTableComponent)
   }
  ]
},
     /* {
        path: 'minhas-reservas',
        canActivate: [authGuard],
        loadComponent: () => import('./features/reservas/components/minhas-reservas/minhas-reservas.component')
          .then(m => m.MinhasReservasComponent)
      },*/
    /*  {
        path: 'reservas/:id',
        canActivate: [authGuard],
        loadComponent: () => import('./features/reservas/components/detalhe-reserva/detalhe-reserva.component')
          .then(m => m.DetalheReservaComponent)
      },*/




 // Rotas Protegidas (com layout)
  {
    path: '',
     component:  MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'admin',
        canActivate: [roleGuard(['Admin'])],
        children: [
         /* {
            path: 'destinos',
            loadComponent: () => import('./features/destinos/components/destino-table/destino-table.component')
              .then(m => m.DestinoTableComponent)
            }*/         
         
        ]
      }
    ]
  },

];
