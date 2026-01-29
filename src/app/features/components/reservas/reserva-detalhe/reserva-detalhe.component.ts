import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MinhasReservasDto, StatuReserva, ReservaDto } from '../../../models/reserva-model/reserva.model';
import { ReservaService } from '../../../../services/reserva/reserva.service';

@Component({
  selector: 'app-reserva-detalhe',
  imports: [CommonModule, FormsModule],
  templateUrl: './reserva-detalhe.component.html',
  styleUrl: './reserva-detalhe.component.css'
})
export class ReservaDetalheComponent {
  // Dados
  reserva: MinhasReservasDto | null = null;
  
  // Estados
  loading = false;
  erro = '';
  
  // Modal de cancelamento
  showCancelModal = false;
  motivoCancelamento = '';
  cancelando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService
  ) {
    this.carregarDetalhes();
  }

  /**
   * ✅ CARREGAR DETALHES DA RESERVA
   */
  carregarDetalhes(): void {
    const id = this.route.snapshot.paramMap.get('id');
    
    if (!id) {
      this.erro = 'ID da reserva não encontrado';
      return;
    }

    this.loading = true;
    this.erro = '';

    this.reservaService.obterReserva(id).subscribe({
      next: (reservaDto: ReservaDto) => {
        // Mapear ReservaDto para MinhasReservasDto
        this.reserva = this.mapearParaMinhasReservas(reservaDto);
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar detalhes:', erro);
        this.erro = 'Erro ao carregar detalhes da reserva. Tente novamente.';
        this.loading = false;
      }
    });
  }

  /**
   * ✅ MAPEAR ReservaDto PARA MinhasReservasDto
   */
  private mapearParaMinhasReservas(dto: ReservaDto): MinhasReservasDto {
    return {
      id: dto.id,
      nomePacote: dto.pacote?.nomePacote || 'Pacote de Viagem',
      nomeCidade: dto.destino?.nomeCidade || 'Destino',
      dataReserva: new Date(dto.dataReserva),
      dataViagem: new Date(dto.dataViagem),
      quantidadePessoas: dto.quantidadePessoas,
      valorTotal: dto.valorTotal,
      statuReserva: this.converterStringParaEnum(dto.statuReserva),
      pagamentoConfirmado: dto.pagamentoConfirmado
    };
  }

  /**
   * ✅ CONVERTER STRING PARA ENUM StatuReserva
   */
  private converterStringParaEnum(status: string): StatuReserva {
    const statusMap: { [key: string]: StatuReserva } = {
      'Pendente': StatuReserva.Pendente,
      'Confirmado': StatuReserva.Confirmado,
      'Pago': StatuReserva.Pago,
      'Cancelado': StatuReserva.Cancelado,
      'Concluida': StatuReserva.Concluida
    };
    
    return statusMap[status] || StatuReserva.Pendente;
  }

  /**
   * ✅ VOLTAR PARA LISTA
   */
  voltarParaLista(): void {
    this.router.navigate(['/minhas-reservas']);
  }

  /**
   * ✅ IR PARA PAGAMENTO
   */
  irParaPagamento(): void {
    if (this.reserva) {
      this.router.navigate(['/pagamento', this.reserva.id]);
    }
  }

  /**
   * ✅ ABRIR MODAL DE CANCELAMENTO
   */
  abrirModalCancelar(): void {
    this.motivoCancelamento = '';
    this.showCancelModal = true;
  }

  /**
   * ✅ FECHAR MODAL DE CANCELAMENTO
   */
  fecharModalCancelar(): void {
    this.showCancelModal = false;
    this.motivoCancelamento = '';
  }

  /**
   * ✅ CONFIRMAR CANCELAMENTO
   */
  confirmarCancelamento(): void {
    if (!this.reserva) return;

    if (!this.motivoCancelamento.trim()) {
      alert('Por favor, informe o motivo do cancelamento.');
      return;
    }

    this.cancelando = true;

    this.reservaService.cancelarReserva(this.reserva.id).subscribe({
      next: () => {
        alert('Reserva cancelada com sucesso!');
        this.fecharModalCancelar();
        this.router.navigate(['/minhas-reservas']);
      },
      error: (erro: any) => {
        console.error('Erro ao cancelar reserva:', erro);
        alert('Erro ao cancelar reserva. Tente novamente.');
        this.cancelando = false;
      }
    });
  }

  /**
   * ✅ VERIFICAR SE PODE CANCELAR
   */
  podeCancelar(): boolean {
    if (!this.reserva) return false;

    const statusPermitidos = [
      StatuReserva.Pendente, 
      StatuReserva.Confirmado
    ];
    
    const hoje = new Date();
    const dataViagem = new Date(this.reserva.dataViagem);
    
    return statusPermitidos.includes(this.reserva.statuReserva) && dataViagem > hoje;
  }

  /**
   * ✅ VERIFICAR SE PODE PAGAR
   */
  podePagar(): boolean {
    if (!this.reserva) return false;
    
    return this.reserva.statuReserva === StatuReserva.Pendente || 
           this.reserva.statuReserva === StatuReserva.Confirmado;
  }

  /**
   * ✅ VERIFICAR STATUS
   */
  isStatusConfirmadoOuSuperior(): boolean {
    if (!this.reserva) return false;
    return this.reserva.statuReserva === StatuReserva.Confirmado || 
           this.reserva.statuReserva === StatuReserva.Pago || 
           this.reserva.statuReserva === StatuReserva.Concluida;
  }

  isStatusPagoOuSuperior(): boolean {
    if (!this.reserva) return false;
    return this.reserva.statuReserva === StatuReserva.Pago || 
           this.reserva.statuReserva === StatuReserva.Concluida;
  }

  isStatusConcluida(): boolean {
    if (!this.reserva) return false;
    return this.reserva.statuReserva === StatuReserva.Concluida;
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
    return icons[status] || '•';
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
   * ✅ FORMATAR HORA
   */
  formatarHora(data: Date): string {
    return new Date(data).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * ✅ CALCULAR DIAS ATÉ A VIAGEM
   */
  diasAteViagem(): number {
    if (!this.reserva) return 0;
    
    const hoje = new Date();
    const viagem = new Date(this.reserva.dataViagem);
    const diff = viagem.getTime() - hoje.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  /**
   * ✅ VERIFICAR SE VIAGEM É PRÓXIMA
   */
  isViagemProxima(): boolean {
    const dias = this.diasAteViagem();
    return dias <= 7 && dias > 0;
  }

  /**
   * ✅ VERIFICAR SE VIAGEM JÁ PASSOU
   */
  viagemJaPassou(): boolean {
    return this.diasAteViagem() < 0;
  }

  /**
   * ✅ IMPRIMIR DETALHES
   */
  imprimirDetalhes(): void {
    window.print();
  }

  /**
   * ✅ COMPARTILHAR RESERVA
   */
  compartilharReserva(): void {
    if (!this.reserva) return;

    const texto = `Reserva #${this.reserva.id.substring(0, 8).toUpperCase()}
Pacote: ${this.reserva.nomePacote}
Destino: ${this.reserva.nomeCidade}
Data: ${this.formatarDataCompleta(this.reserva.dataViagem)}
Pessoas: ${this.reserva.quantidadePessoas}`;

    if (navigator.share) {
      navigator.share({
        title: 'Minha Reserva',
        text: texto
      }).catch(err => console.log('Erro ao compartilhar:', err));
    } else {
      // Fallback: copiar para clipboard
      navigator.clipboard.writeText(texto).then(() => {
        alert('Detalhes copiados para a área de transferência!');
      });
    }
  }
}