import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://ec2-44-211-119-13.compute-1.amazonaws.com:8080/api'; // URL base da API

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken'); // Supondo que o token JWT esteja no localStorage
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  public getFeaturedProducts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/product`);
  }

  public getCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/category`);
  }

  public getProductsByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/category/${categoryId}`);
  }

  public getCategoryById(categoryId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/category/${categoryId}`);
  }

  getProductById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${id}`);
  }

  public getRelatedProducts(categoryName: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/product/category-name/${categoryName}`
    );
  }
}
