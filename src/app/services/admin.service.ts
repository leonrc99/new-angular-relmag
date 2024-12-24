import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = `http://ec2-44-211-119-13.compute-1.amazonaws.com:8080/api`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Supondo que o token JWT esteja no localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  public getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {
      headers: this.getAuthHeaders(),
    });
  }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category`);
  }

  getCategoryById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${id}`);
  }

  getAllProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product`);
  }

  getProductsByCategory(categoryId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/category/${categoryId}`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${id}`);
  }

  createProduct(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProduct(productId: string, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${productId}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  // Método para obter todos os pedidos (vendas)
  getOrdersByUser(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/orders?userId=${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Método para obter todos os produtos
  getProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product`, {
      headers: this.getAuthHeaders(),
    });
  }

  // Método para obter o carrinho de compras do usuário
  getCart(userId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/cart/${userId}`, {
      headers: this.getAuthHeaders(),
    });
  }

  updateUserRole(userId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/admin/${userId}`, data, {
      headers: this.getAuthHeaders(),
    });
  }
  
  createConsultant(userId: string, formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/tarot/consultants/${userId}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }
}
