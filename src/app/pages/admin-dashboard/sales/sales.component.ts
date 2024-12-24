import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { AdminService } from '../../../services/admin.service';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.scss',
})
export class SalesComponent implements OnInit {
  totalRevenue = 500000;
  monthlyRevenue = 50000;
  profit = 20000;
  totalSales: any = 0;
  totalProductsSold: any = 0;
  activeCustomers: any = 0;
  averageTicket: any = 0;
  sales: any[] = [];
  userId: number = 1; // O ID do usuário pode ser dinâmico, dependendo do sistema de autenticação

  constructor(private apiService: AdminService) {}

  ngOnInit(): void {
    this.initializeRevenueChart();
    this.initializeProductSalesChart();
    this.loadSalesData();
  }

  // Carregar dados das vendas e produtos
  loadSalesData(): void {
    // Chama o serviço para obter os pedidos
    this.apiService.getOrdersByUser(this.userId).subscribe((orders: any) => {
      this.sales = orders;
      this.totalSales = orders.length; // Exemplo de como contar vendas
      this.calculateRevenue();
    });

    // Chama o serviço para obter o carrinho do usuário
    this.apiService.getCart(this.userId).subscribe((cart: any) => {
      this.activeCustomers = cart.items.length; // Exemplo de como contar produtos no carrinho
    });

    // Chama o serviço para obter todos os produtos
    this.apiService.getProducts().subscribe((products: any) => {
      this.totalProductsSold = products.length; // Exemplo de como contar produtos
      this.averageTicket = this.calculateAverageTicket(products);
    });
  }

  // Inicializar o gráfico de faturamento
  initializeRevenueChart(): void {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Faturamento (R$)',
            data: [40000, 45000, 50000, 48000, 47000, 52000, 50000, 51000, 49000, 53000, 55000, 60000],
            backgroundColor: 'rgba(106, 90, 205, 0.5)',
            borderColor: 'rgba(106, 90, 205, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Inicializar o gráfico de produtos vendidos
  initializeProductSalesChart(): void {
    const ctx = document.getElementById('productSalesChart') as HTMLCanvasElement;
    new Chart(ctx, {
      type: 'line', // Tipo de gráfico (linha)
      data: {
        labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
        datasets: [
          {
            label: 'Produtos Vendidos',
            data: [120, 150, 180, 170, 160, 200, 190, 220, 210, 230, 240, 250], // Exemplo de dados
            backgroundColor: 'rgba(75, 192, 192, 0.4)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 2,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  // Calcular o faturamento total
  calculateRevenue(): void {
    this.totalRevenue = this.sales.reduce((acc, sale) => acc + sale.total, 0);
  }

  // Calcular o ticket médio
  calculateAverageTicket(products: any[]): number {
    return this.totalRevenue / products.length;
  }
}
