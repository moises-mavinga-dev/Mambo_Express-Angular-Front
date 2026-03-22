import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../../services/reserva/reserva.service';
import { PacoteService } from '../../../../services/pacote/pacote.service';
import { DestinoService } from '../../../../services/destino/destino.service';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { Reserva, StatuReserva } from '../../../models/reserva-model/reserva.model';
import { Pacote } from '../../../models/pacote-model/pacote.model';
import { Destino } from '../../../models/destno-model/destino.model';
import { UsuarioResponseDto } from '../../../models/usuarios.model/usuario.model';

interface RelatorioGeral {
  totalReservas: number;
  totalDestinos: number;
  totalPacotes: number;
  totalUsuarios: number;
  receitaTotal: number;
  receitaMensal: number;
  ticketMedio: number;
  taxaConversao: number;
}

interface ReservasPorStatus {
  pendentes: number;
  confirmadas: number;
  pagas: number;
  canceladas: number;
  concluidas: number;
}

interface DestinoMaisVendido {
  destino: string;
  quantidade: number;
  receita: number;
}

interface PacoteMaisVendido {
  pacote: string;
  quantidade: number;
  receita: number;
}

@Component({
  selector: 'app-relatorios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './relatorios.component.html',
  styleUrl: './relatorios.component.css'
})
export class RelatoriosComponent implements OnInit {
  
  // Dados
  reservas: Reserva[] = [];
  pacotes: Pacote[] = [];
  destinos: Destino[] = [];
  usuarios: UsuarioResponseDto[] = [];
  
  // Relatórios
  relatorioGeral: RelatorioGeral = {
    totalReservas: 0,
    totalDestinos: 0,
    totalPacotes: 0,
    totalUsuarios: 0,
    receitaTotal: 0,
    receitaMensal: 0,
    ticketMedio: 0,
    taxaConversao: 0
  };

  reservasPorStatus: ReservasPorStatus = {
    pendentes: 0,
    confirmadas: 0,
    pagas: 0,
    canceladas: 0,
    concluidas: 0
  };

  destinosMaisVendidos: DestinoMaisVendido[] = [];
  pacotesMaisVendidos: PacoteMaisVendido[] = [];
  
  // Filtros de período
  dataInicio: string = '';
  dataFim: string = '';
  
  // Estados
  loading = false;
  erro = '';

  constructor(
    private reservaService: ReservaService,
    private pacoteService: PacoteService,
    private destinoService: DestinoService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.inicializarDatas();
    this.carregarDados();
  }

  inicializarDatas(): void {
    const hoje = new Date();
    const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
    
    this.dataInicio = this.formatarDataInput(primeiroDiaMes);
    this.dataFim = this.formatarDataInput(hoje);
  }

  formatarDataInput(data: Date): string {
    return data.toISOString().split('T')[0];
  }

  carregarDados(): void {
    this.loading = true;
    this.erro = '';

    // Carregar todos os dados em paralelo
    Promise.all([
      this.carregarReservas(),
      this.carregarPacotes(),
      this.carregarDestinos(),
      this.carregarUsuarios()
    ]).then(() => {
      this.calcularRelatorios();
      this.loading = false;
    }).catch(erro => {
      console.error('Erro ao carregar dados:', erro);
      this.erro = 'Erro ao carregar dados dos relatórios.';
      this.loading = false;
    });
  }

  carregarReservas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.reservaService.todasReservas().subscribe({
        next: (reservas) => {
          this.reservas = this.filtrarReservasPorPeriodo(reservas);
          resolve();
        },
        error: (erro) => reject(erro)
      });
    });
  }

  carregarPacotes(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.pacoteService.obterTodos().subscribe({
        next: (pacotes) => {
          this.pacotes = pacotes;
          resolve();
        },
        error: (erro) => reject(erro)
      });
    });
  }

  carregarDestinos(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.destinoService.obterTodos().subscribe({
        next: (destinos) => {
          this.destinos = destinos;
          resolve();
        },
        error: (erro) => reject(erro)
      });
    });
  }

  carregarUsuarios(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.usuarioService.obterTodosUsuarios().subscribe({
        next: (usuarios) => {
          this.usuarios = usuarios;
          resolve();
        },
        error: (erro) => reject(erro)
      });
    });
  }

  filtrarReservasPorPeriodo(reservas: Reserva[]): Reserva[] {
    if (!this.dataInicio || !this.dataFim) return reservas;

    const inicio = new Date(this.dataInicio);
    const fim = new Date(this.dataFim);

    return reservas.filter(r => {
      const dataReserva = new Date(r.dataReserva);
      return dataReserva >= inicio && dataReserva <= fim;
    });
  }

  calcularRelatorios(): void {
    this.calcularRelatorioGeral();
    this.calcularReservasPorStatus();
    this.calcularDestinosMaisVendidos();
    this.calcularPacotesMaisVendidos();
  }

  calcularRelatorioGeral(): void {
    const reservasPagas = this.reservas.filter(r => 
      r.status === StatuReserva.Pago || r.status === StatuReserva.Concluida
    );

    const receitaTotal = reservasPagas.reduce((sum, r) => sum + r.valorTotal, 0);
    
    this.relatorioGeral = {
      totalReservas: this.reservas.length,
      totalDestinos: this.destinos.length,
      totalPacotes: this.pacotes.length,
      totalUsuarios: this.usuarios.length,
      receitaTotal: receitaTotal,
      receitaMensal: receitaTotal, // Já filtrado por período
      ticketMedio: reservasPagas.length > 0 ? receitaTotal / reservasPagas.length : 0,
      taxaConversao: this.reservas.length > 0 
        ? (reservasPagas.length / this.reservas.length) * 100 
        : 0
    };
  }

  calcularReservasPorStatus(): void {
    this.reservasPorStatus = {
      pendentes: this.reservas.filter(r => r.status === StatuReserva.Pendente).length,
      confirmadas: this.reservas.filter(r => r.status === StatuReserva.Confirmado).length,
      pagas: this.reservas.filter(r => r.status === StatuReserva.Pago).length,
      canceladas: this.reservas.filter(r => r.status === StatuReserva.Cancelado).length,
      concluidas: this.reservas.filter(r => r.status === StatuReserva.Concluida).length
    };
  }

  calcularDestinosMaisVendidos(): void {
    const destinosMap = new Map<string, { quantidade: number, receita: number }>();

    this.reservas.forEach(reserva => {
      const destinoNome = reserva.destino?.nomeCidade || 'Desconhecido';
      const atual = destinosMap.get(destinoNome) || { quantidade: 0, receita: 0 };
      
      destinosMap.set(destinoNome, {
        quantidade: atual.quantidade + 1,
        receita: atual.receita + (reserva.status === StatuReserva.Pago || reserva.status === StatuReserva.Concluida ? reserva.valorTotal : 0)
      });
    });

    this.destinosMaisVendidos = Array.from(destinosMap.entries())
      .map(([destino, data]) => ({ destino, ...data }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);
  }

  calcularPacotesMaisVendidos(): void {
    const pacotesMap = new Map<string, { quantidade: number, receita: number }>();

    this.reservas.forEach(reserva => {
      const pacoteNome = reserva.pacote?.nomePacote || 'Desconhecido';
      const atual = pacotesMap.get(pacoteNome) || { quantidade: 0, receita: 0 };
      
      pacotesMap.set(pacoteNome, {
        quantidade: atual.quantidade + 1,
        receita: atual.receita + (reserva.status === StatuReserva.Pago || reserva.status === StatuReserva.Concluida ? reserva.valorTotal : 0)
      });
    });

    this.pacotesMaisVendidos = Array.from(pacotesMap.entries())
      .map(([pacote, data]) => ({ pacote, ...data }))
      .sort((a, b) => b.quantidade - a.quantidade)
      .slice(0, 5);
  }

  aplicarFiltro(): void {
    this.carregarDados();
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor);
  }

  formatarPercentual(valor: number): string {
    return `${valor.toFixed(1)}%`;
  }

  exportarPDF(): void {
    alert('Funcionalidade de exportar PDF será implementada');
  }

  imprimirRelatorio(): void {
    window.print();
  }
}