import { AfterViewInit, Component, HostListener, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  isUserLogged: boolean = false;
  userInfo: any;
  userName: any;
  isMobileMenuOpen = false;
  isDropdownOpen: { [key: string]: boolean } = {};
  banhos: any[] = [];
  antiquario: any[] = [];
  feiticos: any[] = [];
  seres: any[] = [];
  hp: any[] = [];
  suprimentos: any[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private productSerivce: ProductService
  ) {}

  ngOnInit() {
    this.getLoggedUser();
    this.setMenuCategories();
  }
  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleDropdown(dropdownName: string) {
    this.isDropdownOpen[dropdownName] = !this.isDropdownOpen[dropdownName];
  }

  getLoggedUser(): boolean {
    this.userInfo = this.authService.decodeToken();

    if (this.userInfo !== null) {
      this.userName = this.userInfo.name;
      return (this.isUserLogged = true);
    } else {
      return (this.isUserLogged = false);
    }
  }

  goToPage(path: string) {
    this.router.navigate([path]).then(() => {
      this.getLoggedUser();
    });
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
    location.reload();
  }

  @HostListener('document:click', ['$event'])
  public closeDropdownOnClickOutside(event: Event): void {
    const target = event.target as HTMLElement;
    const isDropdown = target.closest('.dropdown');
    if (!isDropdown) {
      this.isDropdownOpen = {};
    }
  }

  setMenuCategories() {
    this.productSerivce.getCategories().subscribe({
      next: (categories: any[]) => {
        this.banhos = categories.slice(0, 10);
        this.antiquario = categories.slice(10, 22);
        this.feiticos = categories.slice(22, 29);
        this.seres = categories.slice(29, 36);
        this.hp = categories.slice(36, 44);
        this.suprimentos = categories.slice(44, 54);
      },
    });
  }
}
