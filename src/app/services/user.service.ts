import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Supondo que o token JWT esteja no localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me`, { headers: this.getAuthHeaders() });
  }

  updateUserProfile(updatedUser: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/me`, updatedUser, { headers: this.getAuthHeaders() });
  }

  getFavorites(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me/favorites`, { headers: this.getAuthHeaders() });
  }

  addFavorite(productId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/me/favorites/${productId}`, {}, { headers: this.getAuthHeaders() });
  }

  removeFavorite(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/me/favorites/${productId}`, { headers: this.getAuthHeaders() });
  }

  getOrderHistory(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users/me/orders`, { headers: this.getAuthHeaders() });
  }

  deleteOrderById(orderId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/orders/${orderId}`, { headers: this.getAuthHeaders() });
  }
}
