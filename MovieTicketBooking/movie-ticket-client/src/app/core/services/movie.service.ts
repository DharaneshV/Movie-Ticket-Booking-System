import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie, CreateMovieRequest, UpdateMovieRequest } from '../../models/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private baseUrl = 'http://localhost:5000/api/movies';

  constructor(private http: HttpClient) {}

  getAllMovies(): Observable<Movie[]> {
    return this.http.get<Movie[]>(this.baseUrl);
  }

  getMovieById(id: number): Observable<Movie> {
    return this.http.get<Movie>(`${this.baseUrl}/${id}`);
  }

  searchMovies(title: string): Observable<Movie[]> {
    return this.http.get<Movie[]>(`${this.baseUrl}/search?title=${encodeURIComponent(title)}`);
  }

  createMovie(request: CreateMovieRequest): Observable<Movie> {
    return this.http.post<Movie>(this.baseUrl, request);
  }

  updateMovie(id: number, request: UpdateMovieRequest): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, request);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}

