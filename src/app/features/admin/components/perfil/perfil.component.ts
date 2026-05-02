import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../../../../services/usuario/usuario.service';
import { UsuarioResponseDto, AtualizarUsuarioDto, AlterarSenhaDto } from '../../../models/usuarios.model/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  
  usuario: UsuarioResponseDto | null = null;
  
  // Estados
  loading = false;
  loadingSenha = false;
  erro = '';
  mensagemSucesso = '';
  
  // Formulário de Perfil
  formPerfil = {
    nomeUsuario: '',
    email: '',
    telefone: ''
  };
  
  // Formulário de Senha
  formSenha = {
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  };

  // Estados de edição
  editandoPerfil = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    this.loading = true;
    this.erro = '';

    this.usuarioService.getMeuPerfil().subscribe({
      next: (usuario: UsuarioResponseDto) => {
        this.usuario = usuario;
        this.preencherFormulario();
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao carregar perfil:', erro);
        this.erro = 'Erro ao carregar perfil. Tente novamente.';
        this.loading = false;
      }
    });
  }

  preencherFormulario(): void {
    if (this.usuario) {
      this.formPerfil = {
        nomeUsuario: this.usuario.nomeUsuario || '',
        email: this.usuario.email || '',
        telefone: this.usuario.telefone || ''
      };
    }
  }

  habilitarEdicao(): void {
    this.editandoPerfil = true;
  }

  cancelarEdicao(): void {
    this.editandoPerfil = false;
    this.preencherFormulario();
  }

  salvarPerfil(): void {
    if (!this.validarFormularioPerfil()) {
      return;
    }

    const dados: AtualizarUsuarioDto = {
      nomeUsuario: this.formPerfil.nomeUsuario,
      email: this.formPerfil.email,
      telefone: this.formPerfil.telefone
    };

    this.loading = true;

    this.usuarioService.atualizarMeuPerfil(dados).subscribe({
      next: (usuario: UsuarioResponseDto) => {
        this.usuario = usuario;
        this.editandoPerfil = false;
        this.mostrarSucesso('Perfil atualizado com sucesso!');
        this.loading = false;
      },
      error: (erro: any) => {
        console.error('Erro ao atualizar perfil:', erro);
        this.erro = 'Erro ao atualizar perfil. Verifique os dados.';
        this.loading = false;
      }
    });
  }

  alterarSenha(): void {
    if (!this.validarFormularioSenha()) {
      return;
    }

    const dados: AlterarSenhaDto = {
      senhaAtual: this.formSenha.senhaAtual,
      novaSenha: this.formSenha.novaSenha,
      confirmarSenha: this.formSenha.confirmarSenha
    };

    this.loadingSenha = true;

    this.usuarioService.alterarSenha(dados).subscribe({
      next: (response) => {
        this.mostrarSucesso('Senha alterada com sucesso!');
        this.limparFormularioSenha();
        this.loadingSenha = false;
      },
      error: (erro: any) => {
        console.error('Erro ao alterar senha:', erro);
        this.erro = 'Erro ao alterar senha. Verifique a senha atual.';
        this.loadingSenha = false;
      }
    });
  }

  validarFormularioPerfil(): boolean {
    if (!this.formPerfil.nomeUsuario.trim()) {
      alert('O nome é obrigatório');
      return false;
    }
    if (!this.formPerfil.email.trim()) {
      alert('O email é obrigatório');
      return false;
    }
    if (!this.validarEmail(this.formPerfil.email)) {
      alert('Email inválido');
      return false;
    }
    return true;
  }

  validarFormularioSenha(): boolean {
    if (!this.formSenha.senhaAtual.trim()) {
      alert('A senha atual é obrigatória');
      return false;
    }
    if (!this.formSenha.novaSenha.trim()) {
      alert('A nova senha é obrigatória');
      return false;
    }
    if (this.formSenha.novaSenha.length < 6) {
      alert('A nova senha deve ter no mínimo 6 caracteres');
      return false;
    }
    if (this.formSenha.novaSenha !== this.formSenha.confirmarSenha) {
      alert('As senhas não coincidem');
      return false;
    }
    return true;
  }

  validarEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  limparFormularioSenha(): void {
    this.formSenha = {
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    };
  }

  mostrarSucesso(mensagem: string): void {
    this.mensagemSucesso = mensagem;
    this.erro = '';
    setTimeout(() => {
      this.mensagemSucesso = '';
    }, 3000);
  }

  formatarData(data: Date): string {
    return new Date(data).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  getRoleBadgeClass(role: string): string {
    const classes: { [key: string]: string } = {
      'Admin': 'role-admin',
      'Agente': 'role-agente',
      'Cliente': 'role-cliente'
    };
    return classes[role] || 'role-default';
  }

  getIniciais(): string {
    if (!this.usuario?.nomeUsuario) return '??';
    const nomes = this.usuario.nomeUsuario.split(' ');
    if (nomes.length === 1) {
      return nomes[0].substring(0, 2).toUpperCase();
    }
    return (nomes[0][0] + nomes[nomes.length - 1][0]).toUpperCase();
  }
}