import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent {
  users: any[] = [];
  selectedUser: any = null;
  promotionData: any = {
    role: '',
    bio: '',
    specialties: '',
    price: null,
    imageUrl: null,
  };

  imageFile!: File;

  constructor(private adminService: AdminService) {
    this.getAllUsers();
  }

  getAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  getUserRole(role: any): string {
    const rolesMap: { [key: string]: string } = {
      ADMIN: 'Administrador',
      CONSULTANT: 'Tarólogo',
      USER: 'Usuário',
    };
    return rolesMap[role] || 'Role não definida';
  }

  openPromotionForm(user: any) {
    this.selectedUser = user;
    this.promotionData = {
      role: '',
      bio: '',
      specialties: '',
      price: null,
      imageUrl: null,
    };
  }

  closePromotionForm() {
    this.selectedUser = null;
    this.promotionData = {
      role: '',
      bio: '',
      specialties: '',
      price: null,
      imageUrl: null,
    };

    this.getAllUsers();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.promotionData.imageUrl = file;
    }
  }

  submitPromotionForm() {
    if (!this.promotionData.role) {
      alert('Selecione uma função para o usuário.');
      return;
    }

    const userId = this.selectedUser.id;

    if (this.promotionData.role === 'ADMIN') {
      this.adminService
        .updateUserRole(userId, { role: 'ADMIN' })
        .subscribe(() => this.closePromotionForm());
    } else if (this.promotionData.role === 'CONSULTANT') {
      if (
        !this.promotionData.bio ||
        !this.promotionData.specialties ||
        !this.promotionData.price ||
        !this.promotionData.imageUrl
      ) {
        alert('Preencha todos os campos para promover como consultor.');
        return;
      }

      const formData = new FormData();

      formData.append(
        'consultant',
        new Blob(
          [
            JSON.stringify({
              bio: this.promotionData.bio,
              specialties: this.promotionData.specialties,
              price: this.promotionData.price,
            }),
          ],
          { type: 'application/json' }
        )
      );

      formData.append('image', this.promotionData.imageUrl);

      this.adminService
        .createConsultant(userId, formData)
        .subscribe(() => this.closePromotionForm());
    }
  }
}
