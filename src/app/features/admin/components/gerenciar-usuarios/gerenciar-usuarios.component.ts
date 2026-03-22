import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { UsuarioResponseDto, AtualizarUsuarioDto } from '../../../models/usuarios.model/usuario.model';

@Component({
  selector: 'app-gerenciar-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gerenciar-usuarios.component.html',
  styleUrl: './gerenciar-usuarios.component.css'
})
export class GerenciarUsuariosComponent implements OnInit {
  
  usuarios: UsuarioResponseDto[] = [];
  usuariosFiltrados: UsuarioResponseDto[] = [];
  
  // Filtros
  filtroBusca: string = '';
  filtroRole: string = 'todos';
  filtroAtivo: string = 'todos';
  
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
  showRoleModal = false;
  modoEdicao = false;
  usuarioSelecionado: UsuarioResponseDto | null = null;
  
  // Formulário
  form = {
    nomeUsuario: '',
    email: '',
    telefone: ''
  };

  // Roles disponíveis
  rolesDisponiveis = ['Cliente', 'Agente', 'Admin'];
  rolesSelecionadas: string[] = [];
  
  // Estatísticas
  estatisticas = {
    total: 0,
    ativos: 0,
    inativos: 0,
    clientes: 0,
    agentes: 0,
    admins: 0
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.loading = true;
    this.erro = '';

    this.usuarioService.obterTodosUsuarios().subscribe({
      next: (usuarios: UsuarioResponseDto[]) => {
        this.usuarios = usuarios;
        this.aplicarFiltros();
        this.calcularEstatisticas();
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar usuários:', erro);
        this.erro = 'Erro ao carregar usuários. Tente novamente.';
        this.loading = false;
      }
    });
  }

  calcularEstatisticas(): void {
    this.estatisticas = {
      total: this.usuarios.length,
      ativos: this.usuarios.filter(u => u.ativo).length,
      inativos: this.usuarios.filter(u => !u.ativo).length,
      clientes: this.usuarios.filter(u => u.roles.includes('Cliente')).length,
      agentes: this.usuarios.filter(u => u.roles.includes('Agente')).length,
      admins: this.usuarios.filter(u => u.roles.includes('Admin')).length
    };
  }

  aplicarFiltros(): void {
    let resultado = [...this.usuarios];

    // Filtro por busca
    if (this.filtroBusca) {
      const busca = this.filtroBusca.toLowerCase();
      resultado = resultado.filter(u =>
        u.nomeUsuario?.toLowerCase().includes(busca) ||
        u.email?.toLowerCase().includes(busca) ||
        u.telefone?.toLowerCase().includes(busca)
      );
    }

    // Filtro por role
    if (this.filtroRole !== 'todos') {
      resultado = resultado.filter(u => u.roles.includes(this.filtroRole));
    }

    // Filtro por ativo
    if (this.filtroAtivo !== 'todos') {
      resultado = resultado.filter(u => 
        u.ativo === (this.filtroAtivo === 'ativos')
      );
    }

    this.usuariosFiltrados = resultado;
    this.calcularPaginacao();
  }

  calcularPaginacao(): void {
    this.totalPaginas = Math.ceil(this.usuariosFiltrados.length / this.itensPorPagina);
    if (this.paginaAtual > this.totalPaginas && this.totalPaginas > 0) {
      this.paginaAtual = 1;
    }
  }

  get usuariosPaginados(): UsuarioResponseDto[] {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    return this.usuariosFiltrados.slice(inicio, fim);
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

  abrirModalEditar(usuario: UsuarioResponseDto): void {
    this.modoEdicao = true;
    this.usuarioSelecionado = usuario;
    this.form = {
      nomeUsuario: usuario.nomeUsuario || '',
      email: usuario.email || '',
      telefone: usuario.telefone || ''
    };
    this.showModal = true;
  }

  abrirModalRoles(usuario: UsuarioResponseDto): void {
    this.usuarioSelecionado = usuario;
    this.rolesSelecionadas = [...usuario.roles];
    this.showRoleModal = true;
  }

  fecharModal(): void {
    this.showModal = false;
    this.limparFormulario();
  }

  fecharModalRoles(): void {
    this.showRoleModal = false;
    this.rolesSelecionadas = [];
  }

  limparFormulario(): void {
    this.form = {
      nomeUsuario: '',
      email: '',
      telefone: ''
    };
  }

  salvarUsuario(): void {
    if (!this.validarFormulario()) {
      return;
    }

    if (this.usuarioSelecionado) {
      const dados: AtualizarUsuarioDto = {
        nomeUsuario: this.form.nomeUsuario,
        email: this.form.email,
        telefone: this.form.telefone
      };

      this.usuarioService.atualizarUsuario(this.usuarioSelecionado.id, dados).subscribe({
        next: () => {
          this.mostrarSucesso('Usuário atualizado com sucesso!');
          this.carregarUsuarios();
          this.fecharModal();
        },
        error: (erro: any) => {
          console.error('Erro ao atualizar:', erro);
          this.erro = 'Erro ao atualizar usuário.';
        }
      });
    }
  }

  salvarRoles(): void {
    if (!this.usuarioSelecionado) return;

    const rolesAtuais = this.usuarioSelecionado.roles;
    const rolesNovas = this.rolesSelecionadas;

    // Roles para adicionar
    const rolesParaAdicionar = rolesNovas.filter(r => !rolesAtuais.includes(r));
    
    // Roles para remover
    const rolesParaRemover = rolesAtuais.filter(r => !rolesNovas.includes(r));

    let operacoes = 0;
    const totalOperacoes = rolesParaAdicionar.length + rolesParaRemover.length;

    if (totalOperacoes === 0) {
      this.fecharModalRoles();
      return;
    }

    // Adicionar roles
    rolesParaAdicionar.forEach(role => {
      this.usuarioService.atribuirRole(this.usuarioSelecionado!.id, role).subscribe({
        next: () => {
          operacoes++;
          if (operacoes === totalOperacoes) {
            this.finalizarAtualizacaoRoles();
          }
        },
        error: (erro: any) => {
          console.error('Erro ao adicionar role:', erro);
        }
      });
    });

    // Remover roles
    rolesParaRemover.forEach(role => {
      this.usuarioService.removerRole(this.usuarioSelecionado!.id, role).subscribe({
        next: () => {
          operacoes++;
          if (operacoes === totalOperacoes) {
            this.finalizarAtualizacaoRoles();
          }
        },
        error: (erro: any) => {
          console.error('Erro ao remover role:', erro);
        }
      });
    });
  }

  finalizarAtualizacaoRoles(): void {
    this.mostrarSucesso('Permissões atualizadas com sucesso!');
    this.carregarUsuarios();
    this.fecharModalRoles();
  }

  toggleRole(role: string): void {
    const index = this.rolesSelecionadas.indexOf(role);
    if (index > -1) {
      this.rolesSelecionadas.splice(index, 1);
    } else {
      this.rolesSelecionadas.push(role);
    }
  }

  isRoleSelecionada(role: string): boolean {
    return this.rolesSelecionadas.includes(role);
  }

  validarFormulario(): boolean {
    if (!this.form.nomeUsuario.trim()) {
      alert('O nome do usuário é obrigatório');
      return false;
    }
    if (!this.form.email.trim()) {
      alert('O email é obrigatório');
      return false;
    }
    return true;
  }

  excluirUsuario(usuario: UsuarioResponseDto): void {
    if (confirm(`Deseja realmente excluir o usuário "${usuario.nomeUsuario}"?`)) {
      this.usuarioService.deletarUsuario(usuario.id).subscribe({
        next: () => {
          this.mostrarSucesso('Usuário excluído com sucesso!');
          this.carregarUsuarios();
        },
        error: (erro: any) => {
          console.error('Erro ao excluir:', erro);
          this.erro = 'Erro ao excluir usuário. Pode haver dados associados.';
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

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }

  getRolesBadge(roles: string[]): string {
    return roles.join(', ');
  }

  getRoleClass(role: string): string {
    const classes: { [key: string]: string } = {
      'Admin': 'role-admin',
      'Agente': 'role-agente',
      'Cliente': 'role-cliente'
    };
    return classes[role] || 'role-default';
  }
}