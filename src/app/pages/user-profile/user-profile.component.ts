import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  isEditing = false;
  orders: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.fetchUserProfile();
    this.fetchOrderHistory();
  }

  fetchUserProfile(): void {
    this.userService.getUserProfile().subscribe((data) => {
      this.user = data;
    });
  }

  updateProfile(): void {
    this.userService.updateUserProfile(this.user).subscribe((updatedUser) => {
      this.user = updatedUser;
      this.isEditing = false;
      location.reload();
    });
  }

  fetchOrderHistory(): void {
    this.userService.getOrderHistory().subscribe((data) => {
      this.orders = data;
      console.log(data)
    });
  }

  deleteOrder(orderId: string): void {
    this.userService.deleteOrderById(orderId).subscribe(() => {
      location.reload();
    });
  }
}
