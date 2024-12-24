import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../../components/header/header.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { CategoryCardComponent } from '../../components/category-card/category-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    ProductCardComponent,
    CategoryCardComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('carousel') carousel!: ElementRef;

  featuredProducts: any[] = [];
  hpProducts: any[] = [];
  specialProducts: any[] = [];
  userLogged: boolean = false;
  userInfo: any;
  userName: any;
  userId: any;
  cardImage: any;
  cardWidth = 0;

  hpImage: string =
    "bg-[url('https://front-rm.s3.us-east-1.amazonaws.com/assets/images/hp-image.png')]";
    
  swordImage: string =
    "bg-[url('https://front-rm.s3.us-east-1.amazonaws.com/assets/images/sword-image.png')]";

  constructor(
    private productService: ProductService,
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

    this.loadProducts();
  }

  loadProducts() {
    this.loggedUser();

    this.productService.getFeaturedProducts().subscribe((products: any) => {
      this.featuredProducts = products;
      this.featuredProducts.map(res => {
        this.cardImage = res.images[0]
      })
      this.recalculateCardWidth();
    });

    this.productService.getProductsByCategory('2').subscribe((products) => {
      this.hpProducts = products;
      this.recalculateCardWidth();
    });

    this.productService.getProductsByCategory('3').subscribe((products) => {
      this.specialProducts = products;
      this.recalculateCardWidth();
    });
  }

  loggedUser() {
    this.userInfo = this.authService.decodeToken();

    if (this.userInfo !== null) {
      this.userName = this.userInfo.name;
      return (this.userLogged = true);
    } else {
      return (this.userLogged = false);
    }
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
