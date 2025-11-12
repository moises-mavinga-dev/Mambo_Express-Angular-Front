import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { RegistroDto } from '../../models/usuarios.model/usuario.model';
import { AuthService } from '../../../services/auth/auth.service';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  userData: RegistroDto = {
    nomeUsuario: '',
    email: '',
    password: '',
    role: ['Cliente']
  };

  confirmPassword = '';
  selectedRole = 'Cliente';
  acceptTerms = false;
  showPassword = false;
  loading = false;
  submitted = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';

    // Validações
    if (!this.userData.nomeUsuario || !this.userData.email || !this.userData.password) {
      this.errorMessage = 'Por favor, preencha todos os campos obrigatórios.';
      return;
    }

    if (this.userData.password.length < 6 || this.userData.password.length > 12) {
      this.errorMessage = 'A senha deve ter entre 6 e 12 caracteres.';
      return;
    }

    if (this.userData.password !== this.confirmPassword) {
      this.errorMessage = 'As senhas não coincidem.';
      return;
    }

    if (!this.acceptTerms) {
      this.errorMessage = 'Você deve aceitar os termos de uso.';
      return;
    }

    // Atualiza role
    this.userData.role = [this.selectedRole];

    this.loading = true;

    // ✅ USANDO O MÉTODO CORRETO: registrar()
    this.authService.registrar(this.userData).subscribe({
      next: (response) => {
        console.log('Registro bem-sucedido:', response);
        this.router.navigate(['/home']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro no registro:', err);
        this.errorMessage = err.error?.mensagem || err.error?.message || 'Erro ao criar conta. Tente novamente.';
      }
    });
  }
}
