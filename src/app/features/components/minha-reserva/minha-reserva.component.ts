import { Component } from '@angular/core';
import { MinhasReservasDto, Reserva, StatuReserva } from '../../models/reserva-model/reserva.model';
import { ReservaService } from '../../../services/reserva/reserva.service';
import { AuthService } from '../../../services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagamentoService } from '../../../services/pagamento/pagamento.service';

@Component({
  selector: 'app-minha-reserva',
  imports: [CommonModule, FormsModule ],
  templateUrl: './minha-reserva.component.html',
  styleUrl: './minha-reserva.component.css'
})
export class MinhaReservaComponent {
  // Dados 
  reservas: MinhasReservasDto[] = [];
  reservasFiltradas: MinhasReservasDto[] = [];
  
  // Estados
  loading = false;
  erro = '';
  mensagemSucesso = '';
  
  // Filtros
  filtroStatus: string = 'todas';
  ordenacao: string = 'recentes';
  
  // Estatísticas
  estatisticas = {
    total: 0,
    pendentes: 0,
    confirmados: 0,
    pagos: 0,
    cancelados: 0,
    concluidas: 0
  };

  // Modal de cancelamento
  showCancelModal = false;
  reservaSelecionada: MinhasReservasDto | null = null;
  motivoCancelamento = '';
  cancelando = false;

  constructor(
    private reservaService: ReservaService,
    private authService: AuthService,
    private router: Router,
    private pagamentoServico:PagamentoService
  ) {}

  ngOnInit(): void {
    this.carregarReservas();
  }

  /**
   * ✅ CARREGAR RESERVAS DO USUÁRIO
   */
  carregarReservas(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.loading = true;
    this.erro = '';

    this.reservaService.minhasReservas().subscribe({
      next: (reserva) => {
        this.reservas = reserva;
        this.aplicarFiltros();
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (erro) => {
        console.error('Erro ao carregar reservas:', erro);
        this.erro = 'Erro ao carregar suas reservas. Tente novamente.';
        this.loading = false;
      }
    });
  }

  /**
   * ✅ CALCULAR ESTATÍSTICAS
   */ 
  calcularEstatisticas(): void {
    this.estatisticas = {
      total: this.reservas.length,
      pendentes: this.reservas.filter(r => r.statuReserva === StatuReserva.Pendente).length,
      confirmados: this.reservas.filter(r => r.statuReserva === StatuReserva.Confirmado).length,
      pagos: this.reservas.filter(r => r.statuReserva === StatuReserva.Pago).length,
      cancelados: this.reservas.filter(r => r.statuReserva === StatuReserva.Cancelado).length,
      concluidas: this.reservas.filter(r => r.statuReserva === StatuReserva.Concluida).length
    };
  }

  /**
   * ✅ APLICAR FILTROS (CORRIGIDO)
   */
  aplicarFiltros(): void {
    let resultado = [...this.reservas];

    // 🔧 CORREÇÃO: Comparação correta de status
    if (this.filtroStatus !== 'todas') {
      resultado = resultado.filter(r => {
        const statusReserva = r.statuReserva.toString().toLowerCase();
        const filtroAtual = this.filtroStatus.toLowerCase();
        return statusReserva === filtroAtual;
      });
    }

    // Ordenação
    switch (this.ordenacao) {
      case 'recentes':
        resultado.sort((a, b) => 
          new Date(b.dataReserva).getTime() - new Date(a.dataReserva).getTime()
        );
        break;
      case 'antigas':
        resultado.sort((a, b) => 
          new Date(a.dataReserva).getTime() - new Date(b.dataReserva).getTime()
        );
        break;
      case 'viagem-proxima':
        resultado.sort((a, b) => 
          new Date(a.dataViagem).getTime() - new Date(b.dataViagem).getTime()
        );
        break;
      case 'viagem-distante':
        resultado.sort((a, b) => 
          new Date(b.dataViagem).getTime() - new Date(a.dataViagem).getTime()
        );
        break;
    }

    this.reservasFiltradas = resultado;
  }

  /**
   * ✅ MUDAR FILTRO DE STATUS (CORRIGIDO)
   */
  mudarFiltro(status: string): void {
    this.filtroStatus = status;
    this.aplicarFiltros();
  }

  /**
   * ✅ MUDAR ORDENAÇÃO
   */
  mudarOrdenacao(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.ordenacao = select.value;
    this.aplicarFiltros();
  }

  /**
   * ✅ ABRIR MODAL DE CANCELAMENTO
   */
  abrirModalCancelar(reserva: MinhasReservasDto): void {
    this.reservaSelecionada = reserva;
    this.motivoCancelamento = '';
    this.showCancelModal = true;
  }

  /**
   * ✅ FECHAR MODAL DE CANCELAMENTO
   */
  fecharModalCancelar(): void {
    this.showCancelModal = false;
    this.reservaSelecionada = null;
    this.motivoCancelamento = '';
  }

  /**
   * ✅ CONFIRMAR CANCELAMENTO
   */
  confirmarCancelamento(): void {
    if (!this.reservaSelecionada) return;

    if (!this.motivoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }

    this.cancelando = true;

    this.reservaService.cancelarReserva(this.reservaSelecionada.id).subscribe({
      next: () => {
        this.mostrarSucesso('Reserva cancelada com sucesso!');
        this.fecharModalCancelar();
       // this.cancelando = false;
        this.carregarReservas();
      },
      error: (erro) => {
        console.error('Erro ao cancelar reserva:', erro);
        alert('Erro ao cancelar reserva. Tente novamente.');
        this.cancelando = false;
      }
    });
  }

  /**
   * ✅ VERIFICAR SE PODE CANCELAR
   */
  podeCancelar(reserva: MinhasReservasDto): boolean {
    const statusPermitidos = [
      StatuReserva.Pendente, 
      StatuReserva.Confirmado
    ];
    
    const hoje = new Date();
    const dataViagem = new Date(reserva.dataViagem);
    
    return statusPermitidos.includes(reserva.statuReserva) && dataViagem > hoje;
  }

  /**
   * ✅ VERIFICAR SE PODE PAGAR
   */
  podePagar(reserva: MinhasReservasDto): boolean {
    return reserva.statuReserva === StatuReserva.Pendente || 
           reserva.statuReserva === StatuReserva.Confirmado;
           
  }

  /**
   * ✅ IR PARA PAGAMENTO
   */
  irParaPagamento(reserva: MinhasReservasDto): void {
    this.router.navigate(['/pagamento', reserva.id]);
  }

  /**
   * ✅ VER DETALHES DA RESERVA
   */
  verDetalhes(reserva: MinhasReservasDto): void {
    this.router.navigate(['/meus-pagamentos']);
  }

  /**
   * ✅ OBTER CLASSE CSS DO STATUS
   */
  getStatusClass(status: StatuReserva): string {
    const classes: { [key: string]: string } = {
      [StatuReserva.Pendente]: 'status-pendente',
      [StatuReserva.Confirmado]: 'status-confirmado',
      [StatuReserva.Pago]: 'status-pago',
      [StatuReserva.Cancelado]: 'status-cancelado',
      [StatuReserva.Concluida]: 'status-concluida'
    };
    return classes[status] || 'status-default';
  }

  /**
   * ✅ OBTER ÍCONE DO STATUS
   */
  getStatusIcon(status: StatuReserva): string {
    const icons: { [key: string]: string } = {
      [StatuReserva.Pendente]: '⏳',
      [StatuReserva.Confirmado]: '✓',
      [StatuReserva.Pago]: '💳',
      [StatuReserva.Cancelado]: '✗',
      [StatuReserva.Concluida]: '✓'
    };
    return icons[status] || '.';
  }

  /**
   * ✅ FORMATAR DATA
   */
  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  /**
   * ✅ FORMATAR DATA COMPLETA
   */
  formatarDataCompleta(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  /**
   * ✅ CALCULAR DIAS ATÉ A VIAGEM
   */
  diasAteViagem(dataViagem: Date): number {
    const hoje = new Date();
    const viagem = new Date(dataViagem);
    const diff = viagem.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  /**
   * ✅ VERIFICAR SE VIAGEM É PRÓXIMA
   */
  isViagemProxima(dataViagem: Date): boolean {
    return this.diasAteViagem(dataViagem) <= 7 && this.diasAteViagem(dataViagem) > 0;
  }

  /**
   * ✅ MOSTRAR MENSAGEM DE SUCESSO
   */
  mostrarSucesso(mensagem: string): void {
    this.mensagemSucesso = mensagem;
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 5000);
  }

  /**
   * ✅ RECARREGAR LISTA
   */
  recarregar(): void {
    this.carregarReservas();
  }

  /**
   * ✅ NOVA RESERVA
   */
  novaReserva(): void {
    this.router.navigate(['/reserva/criar']);
  }
}