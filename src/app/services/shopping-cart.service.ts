import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private apiUrl = 'http://ec2-44-211-119-13.compute-1.amazonaws.com:8080/api'; // URL base da API
  private token: any;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  public addItemToCart(userId: string, productId: string, quantity: number) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.apiUrl}/cart/items?userId=${userId}&productId=${productId}&quantity=${quantity}`,
      {},
      { headers, responseType: 'text' }
    );
  }

  public getShoppingCart(userId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
    });
    return this.http.get<any[]>(`${this.apiUrl}/cart/${userId}`, {
      headers,
      withCredentials: true,
    });
  }

  public deleteCartItem(itemId: string, userId: string) {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    
    return this.http.delete(
      `${this.apiUrl}/cart/items/${itemId}?userId=${userId}`,
      { headers, responseType: 'text' }
    );
  }

  public checkout(userdId: string): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/payments/${userdId}`, {}, { headers, responseType: 'text' });
  }

  getLoggedUser() {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/api/users/me`, {
      headers,
      withCredentials: true,
    });
  }
}
