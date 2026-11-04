import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Screen, CreateScreenRequest } from '../../models/screen.model';
import { Seat, BulkCreateSeatsRequest } from '../../models/seat.model';

@Injectable({
  providedIn: 'root'
})
export class ScreenService {
  private screensUrl = 'http://localhost:5000/api/screens';
  private seatsUrl = 'http://localhost:5000/api/seats';

  constructor(private http: HttpClient) {}

  getAllScreens(): Observable<Screen[]> {
    return this.http.get<Screen[]>(this.screensUrl);
  }

  getScreensByTheatre(theatreId: number): Observable<Screen[]> {
    return this.http.get<Screen[]>(`${this.screensUrl}/theatre/${theatreId}`);
  }

  createScreen(request: CreateScreenRequest): Observable<Screen> {
    return this.http.post<Screen>(this.screensUrl, request);
  }

  deleteScreen(id: number): Observable<void> {
    return this.http.delete<void>(`${this.screensUrl}/${id}`);
  }

  getSeatsByScreen(screenId: number): Observable<Seat[]> {
    return this.http.get<Seat[]>(`${this.seatsUrl}/screen/${screenId}`);
  }

  bulkCreateSeats(request: BulkCreateSeatsRequest): Observable<Seat[]> {
    return this.http.post<Seat[]>(`${this.seatsUrl}/bulk`, request);
  }
}

