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
      this.productForm = { ...product, categoryId: product.categoryId };
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
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.imageFiles.push(files[i]);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.productForm.images.push(e.target.result); // Adiciona a pré-visualização
      };
      reader.readAsDataURL(files[i]);
    }
  }
  
 submitForm(): void {
    const formData = new FormData();

    // Adiciona os dados do produto como JSON
    formData.append(
      'product',
      new Blob(
        [
          JSON.stringify({
            name: this.productForm.name,
            description: this.productForm.description,
            price: this.productForm.price,
            stock: this.productForm.stock,
            categoryId: this.productForm.categoryId,
          }),
        ],
        { type: 'application/json' }
      )
    );

    // Adiciona as imagens ou um valor vazio
    if (this.imageFiles.length > 0) {
      this.imageFiles.forEach((file) => {
        formData.append('images', file);
      });
    } else {
      // Envia pelo menos uma entrada vazia para evitar o erro de parte ausente
      formData.append('images', new Blob(), '');
    }

    // Chamada ao backend para editar ou criar
    if (this.isEditing) {
      this.adminService.updateProduct(this.productForm.id, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Erro ao atualizar produto:', err),
      });
    } else {
      this.adminService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.showForm = false;
        },
        error: (err) => console.error('Erro ao adicionar produto:', err),
      });
    }
  }

}
