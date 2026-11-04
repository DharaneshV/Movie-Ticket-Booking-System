import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Show, CreateShowRequest, UpdateShowRequest } from '../../models/show.model';
import { ShowSeat } from '../../models/seat.model';

@Injectable({
  providedIn: 'root'
})
export class ShowService {
  private baseUrl = 'http://localhost:5000/api/shows';

  constructor(private http: HttpClient) {}

  getAllShows(): Observable<Show[]> {
    return this.http.get<Show[]>(this.baseUrl);
  }

  getShowById(id: number): Observable<Show> {
    return this.http.get<Show>(`${this.baseUrl}/${id}`);
  }

  getShowsByMovie(movieId: number): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.baseUrl}/movie/${movieId}`);
  }

  getShowsByTheatre(theatreId: number): Observable<Show[]> {
    return this.http.get<Show[]>(`${this.baseUrl}/theatre/${theatreId}`);
  }

  getShowSeats(showId: number): Observable<ShowSeat[]> {
    return this.http.get<ShowSeat[]>(`${this.baseUrl}/${showId}/seats`);
  }

  createShow(request: CreateShowRequest): Observable<Show> {
    return this.http.post<Show>(this.baseUrl, request);
  }

  updateShow(id: number, request: UpdateShowRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  deleteShow(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

