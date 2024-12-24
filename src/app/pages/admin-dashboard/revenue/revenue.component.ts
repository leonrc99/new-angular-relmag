import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-revenue',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './revenue.component.html',
  styleUrl: './revenue.component.scss'
})
export class RevenueComponent {
totalRevenue: any;
monthlyRevenue: any;
profit: any;

}
