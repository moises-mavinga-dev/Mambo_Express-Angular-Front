import { Component } from '@angular/core';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from '../../features/home/home/home.component';

@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent,FooterComponent,RouterOutlet],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
