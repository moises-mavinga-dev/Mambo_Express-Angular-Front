import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../../../services/reserva/reserva.service';
import { PacoteService } from '../../../services/pacote/pacote.service';
import { DestinoService } from '../../../services/destino/destino.service';
import { CriarReservaDto } from '../../models/reserva-model/reserva.model';
import { Pacote } from '../../models/pacote-model/pacote.model';
import { Destino } from '../../models/destno-model/destino.model';

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
     Usuario:'',
 Pacote:'',
 Pagamento:'',
    nomeUsuario: '',
     nomePacote: '',
    email: '',
    telefone: '',
   destinoId: '',
    pacoteId: '',
    dataReserva: '',
    dataViagem: '',
    quantidadePessoas: 1,
    observacoes: ''
  };

  // Lists
  destinos: Destino[] = [];
  pacotes: Pacote[] = [];

  // States
  loading = false;
  loadingData = false;
  showSuccessToast = false;
  dataMinima: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservaService: ReservaService,
    private pacoteService: PacoteService,
    private destinoService: DestinoService
  ) {}

  ngOnInit(): void {
    this.setDataMinima();
    this.carregarDados();
    
    // Se vier com pacoteId na rota
    const pacoteId = this.route.snapshot.params['id'];
    if (pacoteId) {
      this.formData.pacoteId = pacoteId;
    }
  }

  setDataMinima(): void {
    const hoje = new Date();
    this.dataMinima = hoje.toISOString().split('T')[0];
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
        this.loadingData = false;
      }
    });
  }

  onDataInicioChange(): void {
    if (this.formData.dataReserva) {
      if (this.formData.dataViagem && this.formData.dataViagem< this.formData.dataReserva) {
        this.formData.dataViagem = '';
      }
    }
  }

  validarFormulario(): boolean {
    if (!this.formData.nomeUsuario || 
       //!this.formData.nomePacote || 

        !this.formData.email || 
       // !this.formData.Usuario || 
        !this.formData.telefone ||
         !this.formData.destinoId ||
      // !this.formData.pacoteId ||
        !this.formData.dataReserva ||
         !this.formData.dataViagem ||
        !this.formData.quantidadePessoas) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return false;
    }

    return true;
  }

  criarReserva(): void {
    if (!this.validarFormulario()) {
      return;
    }

    // ✅ APENAS pacoteId e dataViagem
    const reservaDto: CriarReservaDto = {
      nomeUsuario:this.formData.nomeUsuario,
     nomePacote:this.formData.nomePacote,
     // usuarioId:this.formData.Usuario,
     //pacoteId:this.formData.pacoteId,
     quantidadePessoas:this.formData.quantidadePessoas,
      dataViagem: new Date(this.formData.dataViagem),
      dataReserva: new Date(this.formData.dataReserva)
    };

    this.loading = true;

    this.reservaService.criarReserva(reservaDto).subscribe({
      next: (reserva: any) => {
        console.log('✅ Reserva criada:', reserva);
        this.loading = false;
        this.showSuccessToast = true;

        setTimeout(() => {
          this.showSuccessToast = false;
          this.router.navigate(['/pagamento/checkout', reserva.id]);
        }, 2000);
      },
      error: (err: any) => {
        console.error('❌ Erro ao criar reserva:', err);
        alert('Erro ao criar reserva. Tente novamente.');
        this.loading = false;
      }
    });
  }
}