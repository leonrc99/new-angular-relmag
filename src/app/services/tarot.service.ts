import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TarotService {
  private apiUrl = 'http://localhost:8080/api'; // URL base da API
  private token: any;

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('authToken');
    }
  }

  public getTarotConsultants(): Observable<any> {
    return this.http.get(`${this.apiUrl}/tarot/consultants`);
  }

  public getConsultantById(consultantId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tarot/consultants/${consultantId}`);
  }
  
  public createAppointment(appointmentData: any): Observable<any> {

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(`${this.apiUrl}/tarot/appointments`, appointmentData, { 
      headers,
      responseType: 'text',
     });
  }
}
