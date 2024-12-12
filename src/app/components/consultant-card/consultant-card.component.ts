import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-consultant-card',
  standalone: true,
  imports: [CommonModule, RouterModule, CurrencyPipe],
  templateUrl: './consultant-card.component.html',
  styleUrl: './consultant-card.component.scss',
})
export class ConsultantCardComponent {
  @Input() consultantId!: string;
  @Input() consultantName!: string;
  @Input() consultantPrice!: string;
  @Input() consultantSpecialties!: string; 
  @Input() imageUrl!: string;

  constructor(private router: Router){}
  
  public goToPage(path: string) {
    this.router.navigate([`/consultant/${path}`])
  }
}
