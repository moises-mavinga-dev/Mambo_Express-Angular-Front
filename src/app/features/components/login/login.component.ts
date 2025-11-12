import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginDto } from '../../models/usuarios.model/usuario.model';
import { AuthService } from '../../../services/auth/auth.service';
@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  credentials: LoginDto = {
    email: '',
    password: ''
  };

  loading = false;
  submitted = false;
  errorMessage = '';
  showPassword = false;
  rememberMe = false;

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = 'Por favor, preencha todos os campos.';
      return;
    }

    this.loading = true;

    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        console.log('Login bem-sucedido:', response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no login:', err);
        
        if (err.status === 401) {
          this.errorMessage = 'Email ou senha incorretos.';
        } else if (err.status === 0) {
          this.errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
        } else {
          this.errorMessage = err.error?.message || 'Erro ao fazer login. Tente novamente.';
        }
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
