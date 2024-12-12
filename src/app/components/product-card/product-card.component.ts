import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ShoppingCartService } from '../../services/shopping-cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
})
export class ProductCardComponent {
  @Input() productName: any;
  @Input() productDescription: any;
  @Input() productPrice: any;
  @Input() productId: any;
  @Input() userId: any;

  constructor(
    private cartService: ShoppingCartService,
    private authService: AuthService,
    private router: Router
  ) {}

  public goToCartPage() {
    this.router.navigate(['/shopping-cart']);
  }

  public addItemToCart(userId: any, productId: string, quantity: number) {
    if (!userId) {
      this.router.navigate(['/login']); // Redirecionar se o usuário não estiver logado
      return;
    }

    this.cartService.addItemToCart(userId, productId, quantity).subscribe({
      next: () => this.router.navigate(['/shopping-cart']),
      error: (err) => console.error('Erro ao adicionar item:', err),
    });
  }
}
