import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MovieService } from '../../../core/services/movie.service';
import { ShowService } from '../../../core/services/show.service';
import { Movie } from '../../../models/movie.model';
import { Show } from '../../../models/show.model';

@Component({
  selector: 'app-movie-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  movieId!: number;
  movie?: Movie;
  shows: Show[] = [];
  isLoadingMovie: boolean = true;
  isLoadingShows: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private showService: ShowService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.movieId = Number(idParam);
      this.loadMovie();
      this.loadShows();
    }
  }

  loadMovie(): void {
    this.isLoadingMovie = true;
    this.cdr.markForCheck();

    this.movieService.getMovieById(this.movieId).subscribe({
      next: (m) => {
        this.movie = m;
        this.isLoadingMovie = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingMovie = false;
        this.errorMessage = 'Movie not found.';
        this.cdr.markForCheck();
      }
    });
  }

  loadShows(): void {
    this.isLoadingShows = true;
    this.cdr.markForCheck();

    this.showService.getShowsByMovie(this.movieId).subscribe({
      next: (data) => {
        this.shows = data || [];
        this.isLoadingShows = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoadingShows = false;
        this.cdr.markForCheck();
      }
    });
  }
}
