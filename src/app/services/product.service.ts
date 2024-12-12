import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8080/api'; // URL base da API

  constructor(private http: HttpClient) {}

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

  public getProductById(productId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/${productId}`);
  }

  public getRelatedProducts(categoryName: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/product/category-name/${categoryName}`);
  }
}
