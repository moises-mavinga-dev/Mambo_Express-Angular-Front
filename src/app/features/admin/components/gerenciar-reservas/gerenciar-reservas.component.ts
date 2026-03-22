import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Reserva, StatuReserva } from '../../../models/reserva-model/reserva.model';
import { ReservaService } from '../../../../services/reserva/reserva.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-gerenciar-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule, ],
  templateUrl: './gerenciar-reservas.component.html',
  styleUrl: './gerenciar-reservas.component.css'
})
export class GerenciarReservasComponent implements OnInit {
  
  reservas: Reserva[] = [];
  reservasFiltradas: Reserva[] = [];
  
  // Filtros
  filtroStatus: string = 'todas';
  filtroBusca: string = '';
  filtroData: string = '';
  
  // Paginação
  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;
  
  // Estados
  loading = false;
  erro = '';
  
  // Modal
  showModal = false;
  reservaSelecionada: Reserva | null = null;
  novoStatus: StatuReserva = StatuReserva.Pendente;
  
  estatisticas = {
    total: 0,
    pendentes: 0,
    confirmadas: 0,
    pagas: 0,
    canceladas: 0,
    concluidas: 0
  };

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.carregarReservas();
  }

  carregarReservas(): void {
    this.loading = true;
    this.erro = '';

    this.reservaService.todasReservas().subscribe({
      next: (reservas: Reserva[]) => {
        this.reservas = reservas;
        this.aplicarFiltros();
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar reservas:', erro);
        this.erro = 'Erro ao carregar reservas. Tente novamente.';
        this.loading = false;
      }
    });
  }

  calcularEstatisticas(): void {
    this.estatisticas = {
      total: this.reservas.length,
      pendentes: this.reservas.filter(r => r.status === StatuReserva.Pendente).length,
      confirmadas: this.reservas.filter(r => r.status === StatuReserva.Confirmado).length,
      pagas: this.reservas.filter(r => r.status === StatuReserva.Pago).length,
      canceladas: this.reservas.filter(r => r.status === StatuReserva.Cancelado).length,
      concluidas: this.reservas.filter(r => r.status === StatuReserva.Concluida).length
    };
  }

  aplicarFiltros(): void {
    let resultado = [...this.reservas];

    // Filtro por status
    if (this.filtroStatus !== 'todas') {
      resultado = resultado.filter(r => 
        r.status.toString().toLowerCase() === this.filtroStatus.toLowerCase()
      );
    }

    // Filtro por busca
    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      resultado = resultado.filter(r =>
        r.usuario?.nomeUsuario?.toLowerCase().includes(busca) ||
        r.pacote?.nomePacote?.toLowerCase().includes(busca) ||
        r.destino?.nomeCidade?.toLowerCase().includes(busca)
      );
    }

    this.reservasFiltradas = resultado;
    this.calcularPaginacao();
  }

  calcularPaginacao(): void {
    this.totalPaginas = Math.ceil(this.reservasFiltradas.length / this.itensPorPagina);
  }

  get reservasPaginadas(): Reserva[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.reservasFiltradas.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  mudarFiltroStatus(status: string): void {
    this.filtroStatus = status;
    this.paginaAtual = 1;
    this.aplicarFiltros();
  }

  buscar(): void {
    this.paginaAtual = 1;
    this.aplicarFiltros();
  }

  abrirModal(reserva: Reserva): void {
    this.reservaSelecionada = reserva;
    this.novoStatus = reserva.status;
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.reservaSelecionada = null;
  }

  atualizarStatus(): void {
    if (!this.reservaSelecionada) return;

    // Implementar atualização no serviço
    console.log('Atualizando status para:', this.novoStatus);
    
    // Simular atualização
    this.reservaSelecionada.status = this.novoStatus;
    this.fecharModal();
    this.calcularEstatisticas();
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

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'numeric',
      year: 'numeric'
    });
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor);
  }

  exportarCSV(): void {
    console.log('Exportando CSV...');
    // Implementar exportação
  }

  imprimirRelatorio(): void {
    window.print();
  }
}