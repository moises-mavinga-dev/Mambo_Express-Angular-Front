import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PagamentoService } from '../../../services/pagamento/pagamento.service';
import { ReservaService } from '../../../services/reserva/reserva.service';
import { 
  ProcessarPagamentoDto, 
  MetodoPagamento, 
  PagamentoStatus 
} from '../../models/pagamento-model/pagamento.model';
import { Reserva } from '../../models/reserva-model/reserva.model';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  reservaId: string = '';
  reserva: Reserva | null = null;
  
  // Form Data
  formData = {
    metodoPagamento: '',
    numeroCartao: '',
    nomeCartao: '',
    validadeCartao: '',
    telefone: '',
    aceitoTermos: false
  };

  // States
  loading = false;
  loadingReserva = false;
  processando = false;
  showSuccessModal = false;
  showErrorModal = false;
  errorMessage = '';
  
  // Enums
  MetodoPagamento = MetodoPagamento;
  metodosPagamento = [
    { value: MetodoPagamento.CartaoCredito, label: 'Cartão de Crédito', icon: '💳' },
    { value: MetodoPagamento.CartaoDebito, label: 'Cartão de Débito', icon: '💳' },
    { value: MetodoPagamento.Transferencia, label: 'Transferência Bancária', icon: '🏦' },
    { value: MetodoPagamento.Express, label: 'Unitel Express', icon: '📱' },
    { value: MetodoPagamento.Multicaixa, label: 'Multicaixa Express', icon: '💰' }
  ];

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private pagamentoService: PagamentoService,
    private reservaService: ReservaService
  ) {}

  ngOnInit(): void {
    this.reservaId = this.route.snapshot.params['id'];
    if (this.reservaId) {
      this.carregarReserva();
    } else {
      alert('ID da reserva não informado');
      this.router.navigate(['/']);
    }
  }

  carregarReserva(): void {
    this.loadingReserva = true;
    
    this.reservaService.obterReserva(this.reservaId).subscribe({
      next: (reserva: Reserva) => {
        this.reserva = reserva;
        this.loadingReserva = false;
      },
      error: (err: any) => {
        console.error('Erro ao carregar reserva:', err);
        alert('Reserva não encontrada');
        this.loadingReserva = false;
        this.router.navigate(['/']);
      }
    });
  }

  get metodoSelecionado() {
    return this.metodosPagamento.find(m => m.value === this.formData.metodoPagamento);
  }

  get precisaCartao(): boolean {
    return this.formData.metodoPagamento === MetodoPagamento.CartaoCredito ||
           this.formData.metodoPagamento === MetodoPagamento.CartaoDebito;
  }

  get precisaTelefone(): boolean {
    return this.formData.metodoPagamento === MetodoPagamento.Express ||
           this.formData.metodoPagamento === MetodoPagamento.Multicaixa;
  }

  formatarCartao(event: any): void {
    let valor = event.target.value.replace(/\s/g, '');
    let formatado = valor.match(/.{1,4}/g)?.join(' ') || valor;
    this.formData.numeroCartao = formatado;
  }

  formatarValidade(event: any): void {
    let valor = event.target.value.replace(/\D/g, '');
    if (valor.length >= 2) {
      valor = valor.substring(0, 2) + '/' + valor.substring(2, 4);
    }
    this.formData.validadeCartao = valor;
  }

  validarFormulario(): boolean {
    if (!this.formData.metodoPagamento) {
      this.errorMessage = 'Selecione um método de pagamento';
      return false;
    }

    if (!this.formData.aceitoTermos) {
      this.errorMessage = 'Você deve aceitar os termos e condições';
      return false;
    }

   /* if (this.precisaCartao) {
      if (!this.formData.numeroCartao || 
          !this.formData.nomeCartao || 
          !this.formData.validadeCartao || 
          !this.formData.cvv) {
        this.errorMessage = 'Preencha todos os dados do cartão';
        return false;
      }

      if (this.formData.numeroCartao.replace(/\s/g, '').length !== 16) {
        this.errorMessage = 'Número do cartão inválido';
        return false;
      }

      if (this.formData.cvv.length !== 3) {
        this.errorMessage = 'CVV inválido';
        return false;
      }
    }*/

    if (this.precisaTelefone && !this.formData.telefone) {
      this.errorMessage = 'Informe o número de telefone';
      return false;
    }

    return true;
  }

  processarPagamento(): void {
    if (!this.validarFormulario()) {
      this.showErrorModal = true;
      return;
    }

    const pagamentoDto: ProcessarPagamentoDto = {
      reservaId: this.reservaId,
      metodoPagamento: this.formData.metodoPagamento as MetodoPagamento
    };

    this.processando = true;

    this.pagamentoService.processarPagamento(pagamentoDto).subscribe({
      next: (pagamento: any) => {
        console.log('✅ Pagamento processado:', pagamento);
        this.processando = false;
        this.showSuccessModal = true;

        // Redireciona após 3 segundos
        setTimeout(() => {
          this.showSuccessModal = false;
          this.router.navigate(['/minhas-reservas']);
        }, 3000);
      },
      error: (err: any) => {
        console.error('❌ Erro ao processar pagamento:', err);
        this.errorMessage = err.error?.message || 'Erro ao processar pagamento. Tente novamente.';
        this.showErrorModal = true;
        this.processando = false;
      }
    });
  }

  fecharModalErro(): void {
    this.showErrorModal = false;
    this.errorMessage = '';
  }

  calcularTotal(): number {
    if (!this.reserva || !this.reserva.pacote) return 0;
    return this.reserva.pacote.preco;
  }
}
