import { Component, OnInit, ViewChild } from '@angular/core';
import { UsuarioResponseDto } from '../../models/usuarios.model/usuario.model';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { MatSort, MatSortModule} from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';


@Component({
  selector: 'app-usuario-table',
  imports: [  CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    MatSortModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatChipsModule
    
  ],
  templateUrl: './usuario-table.component.html',
  styleUrl: './usuario-table.component.css'
})
export class UsuarioTableComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'email', 'telefone', 'roles', 'dataCriacao', 'ativo', 'acoes'];
  dataSource: MatTableDataSource<UsuarioResponseDto>;
  searchValue = '';
  loading = false;
  deleting = false;
  showDeleteModal = false;
  usuarioToDelete: UsuarioResponseDto | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<UsuarioResponseDto>([]);
  }

  ngOnInit(): void {
    this.loadUsuarios();
  }

  loadUsuarios(): void {
    this.loading = true;
    this.usuarioService.obterTodosUsuarios().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.loading = false;
        this.showSnackBar('Erro ao carregar usuários', 'error');
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getInitials(nome: string): string {
    if (!nome) return '?';
    const names = nome.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return nome.substring(0, 2).toUpperCase();
  }

  visualizarUsuario(usuario: UsuarioResponseDto): void {
    // Implementar visualização detalhada
    console.log('Visualizar:', usuario);
    this.showSnackBar(`Visualizando: ${usuario.nomeUsuario}`, 'info');
  }

  editarUsuario(usuario: UsuarioResponseDto): void {
    // Implementar edição
    console.log('Editar:', usuario);
    this.showSnackBar(`Editar: ${usuario.nomeUsuario}`, 'info');
  }

  confirmarDelete(usuario: UsuarioResponseDto): void {
    this.usuarioToDelete = usuario;
    this.showDeleteModal = true;
  }

  deleteUsuario(): void {
    if (!this.usuarioToDelete) return;

    this.deleting = true;
    this.usuarioService.deletarUsuario(this.usuarioToDelete.id).subscribe({
      next: (response) => {
        if (response.sucesso) {
          const currentData = this.dataSource.data;
          this.dataSource.data = currentData.filter(u => u.id !== this.usuarioToDelete!.id);
          this.closeDeleteModal();
          this.showSnackBar('Usuário excluído com sucesso!', 'success');
        } else {
          this.deleting = false;
          this.showSnackBar(response.mensagem, 'error');
        }
      },
      error: (err) => {
        console.error('Erro ao excluir:', err);
        this.deleting = false;
        this.showSnackBar('Erro ao excluir usuário', 'error');
      }
    });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.usuarioToDelete = null;
    this.deleting = false;
  }

  showSnackBar(message: string, type: 'success' | 'error' | 'info'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: [`snackbar-${type}`]
    });
  }
}