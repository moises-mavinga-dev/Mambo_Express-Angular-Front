import { Component } from '@angular/core';
import { Pacote } from '../../../models/pacote-model/pacote.model';
import { PacoteService } from '../../../../services/pacote/pacote.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pacote-card',
  imports: [CommonModule,MatCardModule,MatIconModule,RouterModule],
  templateUrl: './pacote-card.component.html',
  styleUrl: './pacote-card.component.css'
})
export class PacoteCardComponent {
 pacotes:Pacote[] = [];
 currentIndex = 0;
 cardsPerView = 4;
 slideWidth = 100;
 autoPlay = true;
 autoPlayInterval: any;
 autoPlaySpeed = 3000; // 3 segundos
 constructor(private pacoteservice: PacoteService) {}
 get maxIndex(): number {
   return Math.max(0, this.pacotes.length - this.cardsPerView);
 }
 get dots(): number[] {
   return Array(this.maxIndex + 1).fill(0);
 }
 ngOnInit() {
   this.loadDestinos();
   this.updateCardsPerView();
   this.updateSlideWidth();
   window.addEventListener('resize', () => {
     this.updateCardsPerView();
     this.updateSlideWidth();
   });
   if (this.autoPlay) this.startAutoPlay();
 }
 ngOnDestroy() {
   this.stopAutoPlay();
 }
 loadDestinos() {
   this.pacoteservice.obterTodos().subscribe({
     next: (data) => this.pacotes = data,
     error: (err) => console.error('Erro ao carregar destinos:', err)
   });
 }
 updateCardsPerView() {
   const width = window.innerWidth;
   if (width <= 768) {
     this.cardsPerView = 1;
   } else if (width <= 1024) {
     this.cardsPerView = 3;
   } else {
     this.cardsPerView = 4;
   }
 }
 updateSlideWidth() {
   this.slideWidth = 100 / this.cardsPerView;
 }
 nextSlide() {
   if (this.currentIndex < this.maxIndex) {
     this.currentIndex++;
   } else if (this.autoPlay) {
     this.currentIndex = 0;
   }
 }
 prevSlide() {
   if (this.currentIndex > 0) {
     this.currentIndex--;
   } else if (this.autoPlay) {
     this.currentIndex = this.maxIndex;
   }
 }
 goToSlide(index: number) {
   this.currentIndex = index;
   this.stopAutoPlay();
 }
 isCardVisible(index: number): boolean {
   return index >= this.currentIndex && index < this.currentIndex + this.cardsPerView;
 }
 startAutoPlay() {
   this.stopAutoPlay();
   this.autoPlayInterval = setInterval(() => this.nextSlide(), this.autoPlaySpeed);
 }
 stopAutoPlay() {
   if (this.autoPlayInterval) {
     clearInterval(this.autoPlayInterval);
     this.autoPlayInterval = null;
   }
 }
 toggleAutoPlay() {
   this.autoPlay = !this.autoPlay;
   this.autoPlay ? this.startAutoPlay() : this.stopAutoPlay();
 }
}

