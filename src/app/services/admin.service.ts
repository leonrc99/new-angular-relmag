import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api';

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

  createProduct(formData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/product`, formData, {
      headers: this.getAuthHeaders(),
    });
  }

  updateProduct(productId: string, formData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/product/${productId}`, formData, {
      headers: this.getAuthHeaders(),
    });
  }
}
