import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
})
export class ProductsComponent {
  categories: any[] = [];
  products: any[] = [];
  selectedCategory: number | null = null;

  showForm: boolean = false;
  isEditing: boolean = false;
  productForm: any = {
    id: undefined,
    name: '',
    description: '',
    price: null,
    stock: null,
    categoryId: null,
    images: [],
  };
  imageFiles: File[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories(): void {
    this.adminService.getAllCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Erro ao carregar categorias:', err),
    });
  }

  loadProducts(categoryId?: number): void {
    if (categoryId) {
      this.adminService.getProductsByCategory(categoryId).subscribe({
        next: (products) => (this.products = products),
        error: (err) => console.error('Erro ao carregar produtos:', err),
      });
    } else {
      this.adminService.getAllProducts().subscribe({
        next: (products) => (this.products = products),
        error: (err) => console.error('Erro ao carregar produtos:', err),
      });
    }
  }

  onCategoryChange(): void {
    if (this.selectedCategory) {
      this.loadProducts(this.selectedCategory);
    } else {
      this.loadProducts();
    }
  }

  openForm(product: any = null): void {
    this.showForm = true;
    this.isEditing = !!product;
    if (product) {
      this.productForm = { ...product, categoryId: product.category.id };
    } else {
      this.resetForm();
    }
  }

  resetForm(): void {
    this.productForm = {
      id: undefined,
      name: '',
      description: '',
      price: null,
      stock: null,
      categoryId: null,
      images: [],
    };
    this.imageFiles = [];
  }

  handleFileInput(event: any): void {
    const files = event.target.files as FileList; // Confirma que o retorno é FileList
    if (files) {
      Array.from(files).forEach((file) => {
        this.uploadImage(file); // Envia o arquivo para o backend
      });
    }
  }

  uploadImage(file: File): void {
    const formData = new FormData();
    formData.append('file', file);

    this.adminService.uploadImage(formData).subscribe({
      next: (response) => {
        console.log('Upload com sucesso:', response);
        this.productForm.images.push(response.imageUrl);
      },
      error: (err) => {
        console.error('Erro ao fazer upload de imagem:', err);
      },
    });
  }

  submitForm(): void {
    if (this.isEditing) {
      this.adminService
        .updateProduct(this.productForm.id, this.productForm)
        .subscribe({
          next: () => {
            this.loadProducts();
            this.showForm = false;
          },
          error: (err) => console.error('Erro ao atualizar produto:', err),
        });
    } else {
      this.adminService.createProduct(this.productForm).subscribe({
        next: () => {
          this.loadProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Erro ao adicionar produto:', err),
      });
    }
  }
}
