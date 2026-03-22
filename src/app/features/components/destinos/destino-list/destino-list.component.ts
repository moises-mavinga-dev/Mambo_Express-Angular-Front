import { Component, inject } from '@angular/core';
import { DestinoService } from '../../../../services/destino/destino.service';
import { Destino } from '../../../models/destno-model/destino.model';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import{MatTableModule} from '@angular/material/table';
import{MatIconModule} from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-destino-list',
  imports: [FormsModule,MatCardModule,MatTableModule,MatIconModule ,MatPaginatorModule,MatChipsModule,MatProgressSpinnerModule,MatFormFieldModule],
  templateUrl: './destino-list.component.html',
  styleUrl: './destino-list.component.css'
})
export class DestinoListComponent {
  title = 'Tabela de Destinos';
displayedColumns: string[] = ["nomeCidade", "pais", "descricao"];
dataSource: Destino[] = [];
destinoService = inject(DestinoService);

/*totalItems:number=0;*/
/*pagesize:number=10;*/


ngOnInit() {
  this.loadDestinos();
}  
loadDestinos() {
  this.destinoService.obterTodos().subscribe((destino: Destino[]) => {
    this.dataSource = destino;
  });
}


}
