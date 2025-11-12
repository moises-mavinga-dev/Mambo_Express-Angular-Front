import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  AlterarSenhaDto, 
  ApiResponse, 
  AtualizarUsuarioDto, 
  UsuarioResponseDto 
} from '../../models/usuarios.model/usuario.model';
import { AuthService } from '../../../services/auth/auth.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  usuario: UsuarioResponseDto | null = null;
  formData: AtualizarUsuarioDto = {};
  
  senhaData: AlterarSenhaDto = {
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  };

  editMode = false;
  loading = false;
  saving = false;
  changingPassword = false;
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService
  ) {
    // ✅ DEBUG: Verificar se o token existe
    console.log('🔑 Token:', this.authService.getToken());
    console.log('👤 User local:', localStorage.getItem('currentUser'));
  }

  ngOnInit(): void {
    this.carregarPerfil();
  }

  carregarPerfil(): void {
    console.log('📥 Iniciando carregamento do perfil...');
    this.loading = true;
    
    this.usuarioService.getMeuPerfil().subscribe({
      next: (data: UsuarioResponseDto) => {
        console.log('✅ Perfil carregado:', data);
        this.usuario = data;
        this.formData = {
          nomeUsuario: data.nomeUsuario,
          email: data.email,
          telefone: data.telefone
        };
        this.loading = false;
        console.log('📝 FormData preenchido:', this.formData);
      },
      error: (err: any) => {
        console.error('❌ Erro ao carregar perfil:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Mensagem:', err.error);
        
        this.loading = false;
        
        if (err.status === 401) {
          this.showToastMessage('Sessão expirada. Faça login novamente.', 'error');
          setTimeout(() => {
            this.authService.logoutLocal();
          }, 2000);
        } else if (err.status === 404) {
          this.showToastMessage('Endpoint /perfil não encontrado. Verifique o backend.', 'error');
        } else {
          this.showToastMessage('Erro ao carregar perfil. Verifique o console.', 'error');
        }
      }
    });
  }

  getInitials(): string {
    if (!this.usuario?.nomeUsuario) return '?';
    const names = this.usuario.nomeUsuario.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return this.usuario.nomeUsuario.substring(0, 2).toUpperCase();
  }

  enableEdit(): void {
    this.editMode = true;
    console.log('✏️ Modo de edição ativado');
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.usuario) {
      this.formData = {
        nomeUsuario: this.usuario.nomeUsuario,
        email: this.usuario.email,
        telefone: this.usuario.telefone
      };
    }
    console.log('❌ Edição cancelada');
  }

  salvarPerfil(): void {
    console.log('💾 Salvando perfil...', this.formData);
    this.saving = true;
    
    this.usuarioService.atualizarMeuPerfil(this.formData).subscribe({
      next: (usuarioAtualizado: UsuarioResponseDto) => {
        console.log('✅ Perfil atualizado:', usuarioAtualizado);
        this.usuario = usuarioAtualizado;
        localStorage.setItem('currentUser', JSON.stringify(usuarioAtualizado));
        this.saving = false;
        this.editMode = false;
        this.showToastMessage('Perfil atualizado com sucesso!', 'success');
      },
      error: (err: any) => {
        console.error('❌ Erro ao atualizar perfil:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Resposta:', err.error);
        this.saving = false;
        
        if (err.status === 404) {
          this.showToastMessage('Endpoint /perfil (PUT) não encontrado.', 'error');
        } else {
          this.showToastMessage('Erro ao atualizar perfil. Veja o console.', 'error');
        }
      }
    });
  }

  alterarSenha(): void {
    console.log('🔐 Tentando alterar senha...');
    
    if (!this.senhaData.senhaAtual || !this.senhaData.novaSenha) {
      this.showToastMessage('Preencha todos os campos', 'error');
      return;
    }

    if (this.senhaData.novaSenha !== this.senhaData.confirmarSenha) {
      this.showToastMessage('As senhas não coincidem', 'error');
      return;
    }

    if (this.senhaData.novaSenha.length < 6 || this.senhaData.novaSenha.length > 12) {
      this.showToastMessage('A senha deve ter entre 6 e 12 caracteres', 'error');
      return;
    }

    console.log('📤 Enviando dados de senha:', {
      senhaAtual: '***',
      novaSenha: '***',
      confirmarSenha: '***'
    });

    this.changingPassword = true;
    
    this.usuarioService.alterarSenha(this.senhaData).subscribe({
      next: (response: ApiResponse) => {
        console.log('✅ Resposta alteração senha:', response);
        this.changingPassword = false;
        
        if (response.sucesso) {
          this.senhaData = {
            senhaAtual: '',
            novaSenha: '',
            confirmarSenha: ''
          };
          this.showToastMessage('Senha alterada com sucesso!', 'success');
        } else {
          this.showToastMessage(response.mensagem, 'error');
        }
      },
      error: (err: any) => {
        console.error('❌ Erro ao alterar senha:', err);
        console.error('❌ Status:', err.status);
        console.error('❌ Resposta:', err.error);
        this.changingPassword = false;
        
        if (err.status === 404) {
          this.showToastMessage('Endpoint /alterar-senha não encontrado.', 'error');
        } else {
          const message = err.error?.mensagem || 'Erro ao alterar senha. Veja o console.';
          this.showToastMessage(message, 'error');
        }
      }
    });
  }

  logout(): void {
    if (confirm('Tem certeza que deseja sair?')) {
      this.authService.logout().subscribe({
        next: () => {
          console.log('✅ Logout realizado com sucesso');
        },
        error: (err: any) => {
          console.error('❌ Erro no logout:', err);
          this.authService.logoutLocal();
        }
      });
    }
  }

  showToastMessage(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }
}