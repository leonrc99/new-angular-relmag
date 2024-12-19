import { Component } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {
  users: any[] = []

  constructor(private adminService: AdminService){
    this.getAllUsers();
  }

  getAllUsers() {
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  getUserRole(role: any): string | null {
    const adminString: string = 'Administrador';
    const consultantString: string = 'Tarólogo';
    const userString: string = 'Usuário';
    
    if(role === 'ADMIN') {
      return adminString;
    }

    if(role === 'CONSULTANT') {
      return consultantString;
    }

    if(role === 'USER') {
      return userString;
    }

    return 'Role não definida';
  }
}
