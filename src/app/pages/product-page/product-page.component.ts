import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { AuthService } from '../../services/auth.service';
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterModule, ProductCardComponent, BreadcrumbComponent],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.scss',
})
export class ProductPageComponent implements OnInit {
  @ViewChild('carousel') carousel!: ElementRef;

  product: any;
  categoryName: any;
  images: any[] = [];
  relatedProducts!: any[];
  isLoading = true;

  userId: any;
  cardWidth = 0;
  activeImageIndex = 0;

  constructor(
    private route: ActivatedRoute,
    private apiService: ProductService,
    private authService: AuthService,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe({
      next: (user) => {
        this.userId = user?.id || null; // Atualiza o userId quando o usuário está disponível
      },
      error: (err) => console.error('Erro ao obter o usuário:', err),
    });

    this.route.params.subscribe((params) => {
      const productId = params['id'];
      this.loadProductDetails(productId);      
    });    
  }

  loadProductDetails(productId: number): void {
    this.isLoading = true;
    this.apiService.getProductById(productId).subscribe({
      next: (data) => {
        this.product = data;
        this.categoryName = data.categoryName;
        this.images = data.images;

        this.loadRelatedProducts(this.categoryName);
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
      next: (data) => {
        this.relatedProducts = data;
        console.log("teste: ", data);
      },
      error: (err) =>
        console.error('Erro ao carregar produtos relacionados:', err),
    });
  }

  changeActiveImage(index: number): void {
    this.activeImageIndex = index;
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges(); // Forçar detecção de mudanças

    const cardElement =
      this.carousel.nativeElement.querySelector('app-product-card');
    if (cardElement) {
      this.cardWidth = cardElement.offsetWidth + 16; // Largura + gap
    }
  }

  recalculateCardWidth() {
    setTimeout(() => {
      const cardElement =
        this.carousel.nativeElement.querySelector('app-product-card');
      if (cardElement) {
        this.cardWidth = cardElement.offsetWidth + 16;
      }
    });
  }

  scrollLeft() {
    this.carousel.nativeElement.scrollTo({
      left: this.carousel.nativeElement.scrollLeft - this.cardWidth * 4, // Pular 4 cards
      behavior: 'smooth',
    });
  }

  scrollRight() {
    this.carousel.nativeElement.scrollTo({
      left: this.carousel.nativeElement.scrollLeft + this.cardWidth * 4, // Pular 4 cards
      behavior: 'smooth',
    });
  }
}
