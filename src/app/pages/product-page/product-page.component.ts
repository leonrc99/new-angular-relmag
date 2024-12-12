import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderComponent } from "../../components/header/header.component";

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, HeaderComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  product: any;
  categoryName: any;
  relatedProducts!: any[];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private apiService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      this.loadProductDetails(productId);

      const categoryName = this.categoryName;
      this.loadRelatedProducts(categoryName);
    });
  }

  loadProductDetails(productId: string): void {
    this.isLoading = true;
    this.apiService.getProductById(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.categoryName = data.categoryName;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar produto:', err);
        this.isLoading = false;
      },
    });
  }

  loadRelatedProducts(categoryName: string): void {
    this.apiService.getRelatedProducts(categoryName).subscribe({
      next: (data) => (this.relatedProducts = data),
      error: (err) =>
        console.error('Erro ao carregar produtos relacionados:', err),
    });
  }
}
