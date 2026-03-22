import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PacoteService } from '../../../../services/pacote/pacote.service';
import { DestinoService } from '../../../../services/destino/destino.service';
import { Pacote, CriarPacoteDto, AtualizarPacoteDto } from '../../../models/pacote-model/pacote.model';
import { Destino } from '../../../models/destno-model/destino.model';

@Component({
  selector: 'app-gerenciar-pacotes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciar-pacotes.component.html',
  styleUrl: './gerenciar-pacotes.component.css'
})
export class GerenciarPacotesComponent implements OnInit {
  
  pacotes: Pacote[] = [];
  pacotesFiltrados: Pacote[] = [];
  destinos: Destino[] = [];
  
  // Filtros
  filtroBusca: string = '';
  filtroDestino: string = 'todos';
  filtroDisponivel: string = 'todos';
  
  // Paginação
  paginaAtual = 1;
  itensPorPagina = 10;
  totalPaginas = 1;
  
  // Estados
  loading = false;
  erro = '';
  mensagemSucesso = '';
  
  // Modal
  showModal = false;
  modoEdicao = false;
  pacoteSelecionado: Pacote | null = null;
  
  // Formulário (usando campos corretos da API)
  form = {
    nomePacote: '',
    descricao: '',
    preco: 0,
    duracao: 0,
    destinoId: '',
    disponivel: true
  };
  
  // Estatísticas
  estatisticas = {
    total: 0,
    disponiveis: 0,
    indisponiveis: 0
  };

  constructor(
    private pacoteService: PacoteService,
    private destinoService: DestinoService
  ) {}

  ngOnInit(): void {
    this.carregarDestinos();
    this.carregarPacotes();
  }

  carregarDestinos(): void {
    this.destinoService.obterTodos().subscribe({
      next: (destinos: Destino[]) => {
        this.destinos = destinos;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar destinos:', erro);
      }
    });
  }

  carregarPacotes(): void {
    this.loading = true;
    this.erro = '';

    this.pacoteService.obterTodos().subscribe({
      next: (pacotes: Pacote[]) => {
        this.pacotes = pacotes;
        this.aplicarFiltros();
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar pacotes:', erro);
        this.erro = 'Erro ao carregar pacotes. Tente novamente.';
        this.loading = false;
      }
    });
  }

  calcularEstatisticas(): void {
    this.estatisticas = {
      total: this.pacotes.length,
      disponiveis: this.pacotes.filter(p => p.disponivel).length,
      indisponiveis: this.pacotes.filter(p => !p.disponivel).length
    };
  }

  aplicarFiltros(): void {
    let resultado = [...this.pacotes];

    // Filtro por busca
    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      resultado = resultado.filter(p =>
        p.nomePacote?.toLowerCase().includes(busca) ||
        p.descricao?.toLowerCase().includes(busca)
      );
    }

    // Filtro por destino
    if (this.filtroDestino !== 'todos') {
      resultado = resultado.filter(p => p.destinoId === this.filtroDestino);
    }

    // Filtro por disponibilidade
    if (this.filtroDisponivel !== 'todos') {
      resultado = resultado.filter(p => 
        p.disponivel === (this.filtroDisponivel === 'disponiveis')
      );
    }

    this.pacotesFiltrados = resultado;
    this.calcularPaginacao();
  }

  calcularPaginacao(): void {
    this.totalPaginas = Math.ceil(this.pacotesFiltrados.length / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = 1;
    }
  }

  get pacotesPaginados(): Pacote[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.pacotesFiltrados.slice(inicio, fim);
  }

  mudarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaAtual = pagina;
    }
  }

  buscar(): void {
    this.paginaAtual = 1;
    this.aplicarFiltros();
  }

  abrirModalNovo(): void {
    this.modoEdicao = false;
    this.pacoteSelecionado = null;
    this.limparFormulario();
    this.showModal = true;
  }

  abrirModalEditar(pacote: Pacote): void {
    this.modoEdicao = true;
    this.pacoteSelecionado = pacote;
    this.form = {
      nomePacote: pacote.nomePacote || '',
      descricao: pacote.descricao || '',
      preco: pacote.preco || 0,
      duracao: pacote.duracao || 0,
      destinoId: pacote.destinoId || '',
      disponivel: pacote.disponivel
    };
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.form = {
      nomePacote: '',
      descricao: '',
      preco: 0,
      duracao: 0,
      destinoId: '',
      disponivel: true
    };
  }

  salvarPacote(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicao && this.pacoteSelecionado) {
      // Atualizar pacote existente
      const pacoteAtualizado: AtualizarPacoteDto = {
        nomePacote: this.form.nomePacote,
        descricao: this.form.descricao,
        preco: this.form.preco,
        duracao: this.form.duracao,
        disponivel: this.form.disponivel
      };

      this.pacoteService.atualizar(this.pacoteSelecionado.id, pacoteAtualizado).subscribe({
        next: () => {
          this.mostrarSucesso('Pacote atualizado com sucesso!');
          this.carregarPacotes();
          this.fecharModal();
        },
        error: (erro: any) => {
          console.error('Erro ao atualizar:', erro);
          this.erro = 'Erro ao atualizar pacote.';
        }
      });
    } else {
      // Criar novo pacote
      const novoPacote: CriarPacoteDto = {
        nomePacote: this.form.nomePacote,
        descricao: this.form.descricao,
        preco: this.form.preco,
        duracao: this.form.duracao,
        destinoId: this.form.destinoId
      };

      this.pacoteService.criar(novoPacote).subscribe({
        next: () => {
          this.mostrarSucesso('Pacote criado com sucesso!');
          this.carregarPacotes();
          this.fecharModal();
        },
        error: (erro: any) => {
          console.error('Erro ao criar:', erro);
          this.erro = 'Erro ao criar pacote.';
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.form.nomePacote.trim()) {
      alert('O nome do pacote é obrigatório');
      return false;
    }
    if (!this.form.descricao.trim()) {
      alert('A descrição é obrigatória');
      return false;
    }
    if (!this.form.destinoId) {
      alert('Selecione um destino');
      return false;
    }
    if (this.form.preco <= 0) {
      alert('O preço deve ser maior que zero');
      return false;
    }
    if (this.form.duracao <= 0) {
      alert('A duração deve ser maior que zero');
      return false;
    }
    return true;
  }

  toggleDisponivel(pacote: Pacote): void {
    const novoStatus = !pacote.disponivel;
    
    const atualizacao: AtualizarPacoteDto = {
      disponivel: novoStatus
    };

    this.pacoteService.atualizar(pacote.id, atualizacao).subscribe({
      next: () => {
        pacote.disponivel = novoStatus;
        this.calcularEstatisticas();
        this.mostrarSucesso(`Pacote ${novoStatus ? 'disponibilizado' : 'indisponibilizado'} com sucesso!`);
      },
      error: (erro: any) => {
        console.error('Erro ao atualizar disponibilidade:', erro);
        this.erro = 'Erro ao atualizar disponibilidade do pacote.';
      }
    });
  }

  excluirPacote(pacote: Pacote): void {
    if (confirm(`Deseja realmente excluir o pacote "${pacote.nomePacote}"?`)) {
      this.pacoteService.deletar(pacote.id).subscribe({
        next: () => {
          this.mostrarSucesso('Pacote excluído com sucesso!');
          this.carregarPacotes();
        },
        error: (erro: any) => {
          console.error('Erro ao excluir:', erro);
          this.erro = 'Erro ao excluir pacote. Pode haver reservas associadas.';
        }
      });
    }
  }

  mostrarSucesso(mensagem: string): void {
    this.mensagemSucesso = mensagem;
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 3000);
  }

  formatarValor(valor: number): string {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(valor);
  }

  getNomeDestino(destinoId: string): string {
    const destino = this.destinos.find(d => d.id === destinoId);
    return destino ? `${destino.nomeCidade}, ${destino.pais}` : 'N/A';
  }

  formatarDuracao(dias: number): string {
    return dias === 1 ? '1 dia' : `${dias} dias`;
  }
}