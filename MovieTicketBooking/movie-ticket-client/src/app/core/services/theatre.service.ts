import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theatre, CreateTheatreRequest, UpdateTheatreRequest } from '../../models/theatre.model';

@Injectable({
  providedIn: 'root'
})
export class TheatreService {
  private baseUrl = 'http://localhost:5000/api/theatres';

  constructor(private http: HttpClient) {}

  getAllTheatres(): Observable<Theatre[]> {
    return this.http.get<Theatre[]>(this.baseUrl);
  }

  getTheatreById(id: number): Observable<Theatre> {
    return this.http.get<Theatre>(`${this.baseUrl}/${id}`);
  }

  createTheatre(request: CreateTheatreRequest): Observable<Theatre> {
    return this.http.post<Theatre>(this.baseUrl, request);
  }

  updateTheatre(id: number, request: UpdateTheatreRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  deleteTheatre(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

