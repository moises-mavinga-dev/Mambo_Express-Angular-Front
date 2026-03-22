import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinoService } from '../../../../services/destino/destino.service';
import { Destino, DestinoCreateDto, DestinoUpdateDto } from '../../../models/destno-model/destino.model';

@Component({
  selector: 'app-gerenciar-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciar-destinos.component.html',
  styleUrl: './gerenciar-destinos.component.css'
})
export class GerenciarDestinosComponent implements OnInit {
  
  destinos: Destino[] = [];
  destinosFiltrados: Destino[] = [];
  
  // Filtros
  filtroBusca: string = '';
  
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
  destinoSelecionado: Destino | null = null;
  
  // Formulário (usando os campos corretos da API)
  form = {
    nomeCidade: '',
    pais: '',
    descricao: '',
    imagem: ''
  };
  
  // Estatísticas
  estatisticas = {
    total: 0,
    comPacotes: 0,
    semPacotes: 0
  };

  constructor(private destinoService: DestinoService) {}

  ngOnInit(): void {
    this.carregarDestinos();
  }

  carregarDestinos(): void {
    this.loading = true;
    this.erro = '';

    this.destinoService.obterTodos().subscribe({
      next: (destinos: Destino[]) => {
        this.destinos = destinos;
        this.aplicarFiltros();
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar destinos:', erro);
        this.erro = 'Erro ao carregar destinos. Tente novamente.';
        this.loading = false;
      }
    });
  }

  calcularEstatisticas(): void {
    this.estatisticas = {
      total: this.destinos.length,
      comPacotes: this.destinos.filter(d => d.pacotes && d.pacotes.length > 0).length,
      semPacotes: this.destinos.filter(d => !d.pacotes || d.pacotes.length === 0).length
    };
  }

  aplicarFiltros(): void {
    let resultado = [...this.destinos];

    // Filtro por busca
    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      resultado = resultado.filter(d =>
        d.nomeCidade?.toLowerCase().includes(busca) ||
        d.pais?.toLowerCase().includes(busca) ||
        d.descricao?.toLowerCase().includes(busca)
      );
    }

    this.destinosFiltrados = resultado;
    this.calcularPaginacao();
  }

  calcularPaginacao(): void {
    this.totalPaginas = Math.ceil(this.destinosFiltrados.length / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = 1;
    }
  }

  get destinosPaginados(): Destino[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.destinosFiltrados.slice(inicio, fim);
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
    this.destinoSelecionado = null;
    this.limparFormulario();
    this.showModal = true;
  }

  abrirModalEditar(destino: Destino): void {
    this.modoEdicao = true;
    this.destinoSelecionado = destino;
    this.form = {
      nomeCidade: destino.nomeCidade || '',
      pais: destino.pais || '',
      descricao: destino.descricao || '',
      imagem: destino.imagem || ''
    };
    this.showModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.limparFormulario();
  }

  limparFormulario(): void {
    this.form = {
      nomeCidade: '',
      pais: '',
      descricao: '',
      imagem: ''
    };
  }

  salvarDestino(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.modoEdicao && this.destinoSelecionado) {
      // Atualizar destino existente
      const destinoAtualizado: DestinoUpdateDto = {
        nomeCidade: this.form.nomeCidade,
        pais: this.form.pais,
        descricao: this.form.descricao,
        imagem: this.form.imagem
      };

      this.destinoService.atualizar(this.destinoSelecionado.id, destinoAtualizado).subscribe({
        next: () => {
          this.mostrarSucesso('Destino atualizado com sucesso!');
          this.carregarDestinos();
          this.fecharModal();
        },
        error: (erro: any) => {
          console.error('Erro ao atualizar:', erro);
          this.erro = 'Erro ao atualizar destino.';
        }
      });
    } else {
      // Criar novo destino
      const novoDestino: DestinoCreateDto = {
        nomeCidade: this.form.nomeCidade,
        pais: this.form.pais,
        descricao: this.form.descricao,
        imagem: this.form.imagem
      };

      this.destinoService.criar(novoDestino).subscribe({
        next: () => {
          this.mostrarSucesso('Destino criado com sucesso!');
          this.carregarDestinos();
          this.fecharModal();
        },
        error: (erro: any) => {
          console.error('Erro ao criar:', erro);
          this.erro = 'Erro ao criar destino.';
        }
      });
    }
  }

  validarFormulario(): boolean {
    if (!this.form.nomeCidade.trim()) {
      alert('O nome da cidade é obrigatório');
      return false;
    }
    if (!this.form.pais.trim()) {
      alert('O país é obrigatório');
      return false;
    }
    if (!this.form.descricao?.trim()) {
      alert('A descrição é obrigatória');
      return false;
    }
    return true;
  }

  excluirDestino(destino: Destino): void {
    if (confirm(`Deseja realmente excluir o destino "${destino.nomeCidade}, ${destino.pais}"?`)) {
      this.destinoService.deletar(destino.id).subscribe({
        next: () => {
          this.mostrarSucesso('Destino excluído com sucesso!');
          this.carregarDestinos();
        },
        error: (erro: any) => {
          console.error('Erro ao excluir:', erro);
          this.erro = 'Erro ao excluir destino. Pode haver pacotes associados.';
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

  contarPacotes(destino: Destino): number {
    return destino.pacotes?.length || 0;
  }
}