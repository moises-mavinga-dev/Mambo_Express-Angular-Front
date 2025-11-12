import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { DestinoCardComponent } from '../../components/destinos/destino-card/destino-card.component';
import { PacoteCardComponent } from '../../components/pacotes/pacote-card/pacote-card.component';

@Component({
  selector: 'app-home',
  imports: [CommonModule,RouterModule,DestinoCardComponent,PacoteCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
