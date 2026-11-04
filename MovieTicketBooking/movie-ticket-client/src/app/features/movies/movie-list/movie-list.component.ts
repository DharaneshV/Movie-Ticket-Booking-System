import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-movie-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  movies: Movie[] = [];
  filteredMovies: Movie[] = [];
  searchQuery: string = '';
  selectedGenre: string = 'All';
  genres: string[] = ['All'];
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private movieService: MovieService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMovies();
  }

  loadMovies(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.movieService.getAllMovies().subscribe({
      next: (data) => {
        this.movies = data || [];
        this.extractGenres();
        this.filterMovies();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load movies. Please make sure the backend is running.';
          this.cdr.markForCheck();
        }
      });
  }

  extractGenres(): void {
    const genreSet = new Set<string>();
    genreSet.add('All');
    this.movies.forEach((m) => {
      if (m.genre) {
        genreSet.add(m.genre);
      }
    });
    this.genres = Array.from(genreSet);
  }

  filterMovies(): void {
    let result = [...this.movies];

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase().trim();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.description && m.description.toLowerCase().includes(q)) ||
          m.language.toLowerCase().includes(q)
      );
    }

    if (this.selectedGenre !== 'All') {
      result = result.filter((m) => m.genre === this.selectedGenre);
    }

    this.filteredMovies = result;
    this.cdr.markForCheck();
  }

  onSearch(): void {
    this.filterMovies();
  }

  onSelectGenre(genre: string): void {
    this.selectedGenre = genre;
    this.filterMovies();
  }
}
