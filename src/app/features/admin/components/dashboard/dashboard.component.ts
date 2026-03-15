import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReservaService } from '../../../../services/reserva/reserva.service';
import { Reserva, StatuReserva } from '../../../models/reserva-model/reserva.model';

interface DashboardStats {
  totalReservas: number;
  reservasPendentes: number;
  totalDestinos: number;
  totalPacotes: number;
  receitaMensal: number;
  usuariosAtivos: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  
  stats: DashboardStats = {
    totalReservas: 0,
    reservasPendentes: 0,
    totalDestinos: 0,
    totalPacotes: 0,
    receitaMensal: 0,
    usuariosAtivos: 0
  };

  recentReservas: Reserva[] = [];
  loading = false;
  erro = '';

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados(): void {
    this.loading = true;
    this.erro = '';

    // Buscar todas as reservas da API
    this.reservaService.todasReservas().subscribe({
      next: (reservas: Reserva[]) => {
        // Calcular estatísticas baseadas nos dados reais
        this.calcularEstatisticas(reservas);
        
        // Pegar as 5 reservas mais recentes
        this.recentReservas = this.ordenarPorDataRecente(reservas).slice(0, 5);
        
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar dados do dashboard:', erro);
        this.erro = 'Erro ao carregar dados. Usando valores padrão.';
        this.loading = false;
        
        // Usar dados mockados em caso de erro
        this.usarDadosMockados();
      }
    });
  }

  calcularEstatisticas(reservas: Reserva[]): void {
    // Total de reservas
    this.stats.totalReservas = reservas.length;

    // Reservas pendentes
    this.stats.reservasPendentes = reservas.filter(
      r => r.status === StatuReserva.Pendente
    ).length;

    // Receita mensal (soma de todas as reservas pagas)
    this.stats.receitaMensal = reservas
      .filter(r => r.status === StatuReserva.Pago || r.status === StatuReserva.Concluida)
      .reduce((total, r) => total + r.valorTotal, 0);

    // Destinos únicos (contar destinos diferentes)
    const destinosUnicos = new Set(reservas.map(r => r.destinoId));
    this.stats.totalDestinos = destinosUnicos.size;

    // Pacotes únicos (contar pacotes diferentes)
    const pacotesUnicos = new Set(reservas.map(r => r.pacoteId));
    this.stats.totalPacotes = pacotesUnicos.size;

    // Usuários únicos (contar usuários diferentes)
    const usuariosUnicos = new Set(reservas.map(r => r.usuarioId));
    this.stats.usuariosAtivos = usuariosUnicos.size;
  }

  ordenarPorDataRecente(reservas: Reserva[]): Reserva[] {
    return [...reservas].sort((a, b) => {
      const dataA = new Date(a.dataReserva).getTime();
      const dataB = new Date(b.dataReserva).getTime();
      return dataB - dataA; // Mais recente primeiro
    });
  }

  usarDadosMockados(): void {
    // Dados de exemplo em caso de erro na API
    this.stats = {
      totalReservas: 156,
      reservasPendentes: 23,
      totalDestinos: 12,
      totalPacotes: 45,
      receitaMensal: 2450000,
      usuariosAtivos: 234
    };
  }

  getStatusClass(status: StatuReserva): string {
    const classes: { [key: string]: string } = {
      [StatuReserva.Pendente]: 'status-pendente',
      [StatuReserva.Confirmado]: 'status-confirmado',
      [StatuReserva.Pago]: 'status-pago',
      [StatuReserva.Cancelado]: 'status-cancelado',
      [StatuReserva.Concluida]: 'status-concluida'
    };
    return classes[status] || '';
  }

  getStatusTexto(status: StatuReserva): string {
    const textos: { [key: string]: string } = {
      [StatuReserva.Pendente]: 'Pendente',
      [StatuReserva.Confirmado]: 'Confirmado',
      [StatuReserva.Pago]: 'Pago',
      [StatuReserva.Cancelado]: 'Cancelado',
      [StatuReserva.Concluida]: 'Concluída'
    };
    return textos[status] || status.toString();
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  recarregar(): void {
    this.carregarDados();
  }
}