import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { TarotService } from '../../services/tarot.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";
import { ConsultantCardComponent } from "../../components/consultant-card/consultant-card.component";

@Component({
  selector: 'app-tarot-list',
  standalone: true,
  imports: [RouterModule, CommonModule, HeaderComponent, ConsultantCardComponent],
  templateUrl: './tarot-list.component.html',
  styleUrl: './tarot-list.component.scss'
})
export class TarotListComponent  implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;

  consultants: any[] = [];
  isLoading = true;

  constructor(private tarotService: TarotService) {}

  ngOnInit(): void {
    this.loadConsultants();
  }

  loadConsultants(): void {
    this.isLoading = true;
    this.tarotService.getTarotConsultants().subscribe({
      next: (data) => {
        this.consultants = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar tarólogos:', err);
        this.isLoading = false;
      },
    });
  }

  
  cardWidth = 0;

  ngAfterViewInit() {
    // Calcular a largura do card dinamicamente
    const cardElement =
      this.carousel.nativeElement.querySelector('app-consultant-card');
    if (cardElement) {
      this.cardWidth = cardElement.offsetWidth + 16; // Largura + espaçamento (gap)
    }
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollBy({
      left: -this.cardWidth * 4, // Pular 4 cards
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollBy({
      left: this.cardWidth * 4, // Pular 4 cards
      behavior: 'smooth',
    });
  }
}
