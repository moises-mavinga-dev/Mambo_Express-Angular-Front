import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva/reserva.service';
import { PacoteService } from '../../../services/pacote/pacote.service';
import { DestinoService } from '../../../services/destino/destino.service';
import { AuthService } from '../../../services/auth/auth.service';
import { CriarReservaDto, ReservaResponseDto } from '../../models/reserva-model/reserva.model';
import { Pacote } from '../../models/pacote-model/pacote.model';
import { Destino } from '../../models/destno-model/destino.model';
import { MinhaReservaComponent } from '../minha-reserva/minha-reserva.component';

@Component({
  selector: 'app-criar-reserva',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './criar-reserva.component.html',
  styleUrls: ['./criar-reserva.component.css']
})
export class CriarReservaComponent implements OnInit {
  // Form Data
  formData = {
    destinoId: '',
    pacoteId: '',
    dataViagem: '',
    quantidadePessoas: 1
  };

  // Lists
  destinos: Destino[] = [];
  pacotes: Pacote[] = [];
  pacotesFiltrados: Pacote[] = [];
  
  // Selected
  destinoSelecionado: Destino | null = null;
  pacoteSelecionado: Pacote | null = null;
  nomeUsuario: string = '';

  // States
  loading = false;
  loadingData = false;
  showSuccessToast = false;
  dataMinima: string = '';

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private reservaService: ReservaService,
    private pacoteService: PacoteService,
    private destinoService: DestinoService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.setDataMinima();
    this.obterNomeUsuario();
    this.carregarDados();
    
    // Se vier com pacoteId na rota
    const pacoteId = this.route.snapshot.params['pacoteId'];
    if (pacoteId) {
      this.formData.pacoteId = pacoteId;
      this.carregarPacoteSelecionado(pacoteId);
    }
  }

  obterNomeUsuario(): void {
    // Pega o nome do usuário do AuthService ou token
    const user = this.authService.getCurrentUser();
    this.nomeUsuario = user?.nomeUsuario || user?.nomeUsuario || '';
    
    if (!this.nomeUsuario) {
      alert('Usuário não autenticado');
      this.router.navigate(['/login']);
    }
  }

  setDataMinima(): void {
    const hoje = new Date();
    hoje.setDate(hoje.getDate() + 1);
    this.dataMinima = hoje.toISOString().split('T')[0];
    
    const seteDias = new Date();
    seteDias.setDate(seteDias.getDate() + 7);
    this.formData.dataViagem = seteDias.toISOString().split('T')[0];
  }

  carregarDados(): void {
    this.loadingData = true;

    // Carregar destinos
    this.destinoService.getAll().subscribe({
      next: (destinos) => {
        this.destinos = destinos;
      },
      error: (err) => console.error('Erro ao carregar destinos:', err)
    });

    // Carregar pacotes
    this.pacoteService.obterTodos().subscribe({
      next: (pacotes) => {
        this.pacotes = pacotes;
        this.loadingData = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pacotes:', err);
        alert('Erro ao carregar pacotes. Tente novamente.');
        this.loadingData = false;
      }
    });
  }

  onDestinoChange(): void {
    if (this.formData.destinoId) {
      // Encontra o destino selecionado
      this.destinoSelecionado = this.destinos.find(d => d.id === this.formData.destinoId) || null;
      
      // Filtra pacotes por destino
      this.pacotesFiltrados = this.pacotes.filter(p => p.destinoId === this.formData.destinoId);
      
      // Limpa pacote selecionado se não estiver na lista filtrada
      if (this.formData.pacoteId) {
        const pacoteValido = this.pacotesFiltrados.find(p => p.id === this.formData.pacoteId);
        if (!pacoteValido) {
          this.formData.pacoteId = '';
          this.pacoteSelecionado = null;
        }
      }
    } else {
      this.destinoSelecionado = null;
      this.pacotesFiltrados = [];
      this.formData.pacoteId = '';
      this.pacoteSelecionado = null;
    }
  }

  onPacoteChange(): void {
    if (this.formData.pacoteId) {
      this.carregarPacoteSelecionado(this.formData.pacoteId);
    } else {
      this.pacoteSelecionado = null;
    }
  }

  carregarPacoteSelecionado(pacoteId: string): void {
    this.pacoteService.obterPorId(pacoteId).subscribe({
      next: (pacote) => {
        this.pacoteSelecionado = pacote;
        
        // Se vier da rota, preenche destino automaticamente
        if (pacote.destinoId && !this.formData.destinoId) {
          this.formData.destinoId = pacote.destinoId;
          this.onDestinoChange();
        }
      },
      error: (err) => {
        console.error('Erro ao carregar pacote:', err);
      }
    });
  }

  calcularValorTotal(): number {
    if (!this.pacoteSelecionado) return 0;
    return this.pacoteSelecionado.preco * this.formData.quantidadePessoas;
  }

  validarFormulario(): boolean {
    if (!this.nomeUsuario) {
      alert('Usuário não identificado. Faça login novamente.');
      return false;
    }

    if (!this.formData.destinoId) {
      alert('Por favor, selecione um destino');
      return false;
    }

    if (!this.formData.pacoteId || !this.pacoteSelecionado) {
      alert('Por favor, selecione um pacote');
      return false;
    }

    if (!this.formData.dataViagem) {
      alert('Por favor, selecione a data da viagem');
      return false;
    }

    if (this.formData.quantidadePessoas < 1) {
      alert('Quantidade de pessoas deve ser no mínimo 1');
      return false;
    }

    if (this.formData.quantidadePessoas > 20) {
      alert('Quantidade máxima de pessoas é 20');
      return false;
    }

    return true;
  }

  criarReserva(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (!this.pacoteSelecionado || !this.destinoSelecionado) {
      alert('Dados incompletos');
      return;
    }

    // Cria o DTO conforme esperado pela API
    const reservaDto: CriarReservaDto = {
      nomeUsuario: this.nomeUsuario,
      nomePacote: this.pacoteSelecionado.nomePacote,
      nomeCidade: this.destinoSelecionado.nomeCidade,
      quantidadePessoas: this.formData.quantidadePessoas,
      dataViagem: new Date(this.formData.dataViagem)
    };

    console.log('📤 Enviando reserva:', reservaDto);

    this.loading = true;

    this.reservaService.criarReserva(reservaDto).subscribe({
      next: (reserva: ReservaResponseDto) => {
        console.log('✅ Reserva criada:', MinhaReservaComponent);
        this.loading = false;
        this.showSuccessToast = true;

        setTimeout(() => {
          this.showSuccessToast = false;
          this.router.navigate(['pagamento', reserva.id]);
        }, 2000);
      },
      error: (err: any) => {
        console.error('❌ Erro ao criar reserva:', err);
        const mensagem = err.error?.message || err.error || 'Erro ao criar reserva. Tente novamente.';
        alert(mensagem);
        this.loading = false;
      }
    });
  }
}