import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../../core/services/movie.service';
import { TheatreService } from '../../../core/services/theatre.service';
import { ScreenService } from '../../../core/services/screen.service';
import { ShowService } from '../../../core/services/show.service';
import { BookingService } from '../../../core/services/booking.service';
import { Movie, CreateMovieRequest } from '../../../models/movie.model';
import { Theatre, CreateTheatreRequest } from '../../../models/theatre.model';
import { Screen, CreateScreenRequest } from '../../../models/screen.model';
import { Show, CreateShowRequest } from '../../../models/show.model';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'movies' | 'theatres' | 'shows' | 'bookings' = 'movies';

  // Data
  movies: Movie[] = [];
  theatres: Theatre[] = [];
  screens: Screen[] = [];
  shows: Show[] = [];
  bookings: Booking[] = [];

  // Loading & Alerts
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  // New Movie Form
  newMovie: CreateMovieRequest = {
    title: '',
    genre: 'Action',
    language: 'English',
    durationMinutes: 120,
    releaseDate: new Date().toISOString().split('T')[0],
    description: ''
  };

  // New Theatre Form
  newTheatre: CreateTheatreRequest = {
    name: '',
    location: ''
  };

  // New Screen Form
  newScreen: CreateScreenRequest = {
    theatreId: 0,
    screenName: ''
  };

  // New Show Form
  newShow: CreateShowRequest = {
    movieId: 0,
    screenId: 0,
    startTime: '',
    endTime: '',
    ticketPrice: 200
  };

  constructor(
    private movieService: MovieService,
    private theatreService: TheatreService,
    private screenService: ScreenService,
    private showService: ShowService,
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.isLoading = true;
    this.cdr.markForCheck();

    this.movieService.getAllMovies().subscribe({
      next: (d) => {
        this.movies = d || [];
        this.cdr.markForCheck();
      }
    });

    this.theatreService.getAllTheatres().subscribe({
      next: (d) => {
        this.theatres = d || [];
        this.cdr.markForCheck();
      }
    });

    this.screenService.getAllScreens().subscribe({
      next: (d) => {
        this.screens = d || [];
        this.cdr.markForCheck();
      }
    });

    this.showService.getAllShows().subscribe({
      next: (d) => {
        this.shows = d || [];
        this.cdr.markForCheck();
      }
    });

    this.bookingService.getAllBookings().subscribe({
      next: (d) => {
        this.bookings = d || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }

  clearAlerts(): void {
    this.successMessage = '';
    this.errorMessage = '';
  }

  // --- MOVIES ---
  onCreateMovie(): void {
    this.clearAlerts();
    if (!this.newMovie.title.trim()) {
      this.errorMessage = 'Movie title is required.';
      this.cdr.markForCheck();
      return;
    }

    this.movieService.createMovie(this.newMovie).subscribe({
      next: (created) => {
        this.successMessage = `Movie "${created.title}" added successfully!`;
        this.movies.push(created);
        this.newMovie = {
          title: '',
          genre: 'Action',
          language: 'English',
          durationMinutes: 120,
          releaseDate: new Date().toISOString().split('T')[0],
          description: ''
        };
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create movie.';
        this.cdr.markForCheck();
      }
    });
  }

  onDeleteMovie(movie: Movie): void {
    if (!confirm(`Are you sure you want to delete movie "${movie.title}"?`)) return;
    this.clearAlerts();

    this.movieService.deleteMovie(movie.movieId).subscribe({
      next: () => {
        this.successMessage = `Movie "${movie.title}" deleted.`;
        this.movies = this.movies.filter((m) => m.movieId !== movie.movieId);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to delete movie (may have shows attached).';
        this.cdr.markForCheck();
      }
    });
  }

  // --- THEATRES & SCREENS ---
  onCreateTheatre(): void {
    this.clearAlerts();
    if (!this.newTheatre.name.trim() || !this.newTheatre.location.trim()) {
      this.errorMessage = 'Theatre name and location are required.';
      this.cdr.markForCheck();
      return;
    }

    this.theatreService.createTheatre(this.newTheatre).subscribe({
      next: (created) => {
        this.successMessage = `Theatre "${created.name}" created!`;
        this.theatres.push(created);
        this.newTheatre = { name: '', location: '' };
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create theatre.';
        this.cdr.markForCheck();
      }
    });
  }

  onCreateScreen(): void {
    this.clearAlerts();
    if (!this.newScreen.theatreId || !this.newScreen.screenName.trim()) {
      this.errorMessage = 'Please select a theatre and enter a screen name.';
      this.cdr.markForCheck();
      return;
    }

    this.screenService.createScreen(this.newScreen).subscribe({
      next: (created) => {
        this.successMessage = `Screen "${created.screenName}" added!`;
        this.screens.push(created);
        this.newScreen = { theatreId: 0, screenName: '' };
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to create screen.';
        this.cdr.markForCheck();
      }
    });
  }

  // --- SHOWS ---
  onCreateShow(): void {
    this.clearAlerts();
    if (!this.newShow.movieId || !this.newShow.screenId || !this.newShow.startTime || !this.newShow.endTime) {
      this.errorMessage = 'Please fill in all show schedule fields.';
      this.cdr.markForCheck();
      return;
    }

    this.showService.createShow(this.newShow).subscribe({
      next: (created) => {
        this.successMessage = 'Show scheduled successfully!';
        this.shows.push(created);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error || err.error?.message || 'Failed to schedule show.';
        this.cdr.markForCheck();
      }
    });
  }

  onDeleteShow(show: Show): void {
    if (!confirm(`Delete show for "${show.movieTitle}" at ${show.startTime}?`)) return;
    this.clearAlerts();

    this.showService.deleteShow(show.showId).subscribe({
      next: () => {
        this.successMessage = 'Show deleted.';
        this.shows = this.shows.filter((s) => s.showId !== show.showId);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error || 'Failed to delete show (may have bookings).';
        this.cdr.markForCheck();
      }
    });
  }

  // --- BOOKINGS ---
  onCancelBookingAdmin(booking: Booking): void {
    if (!confirm(`Cancel booking ${booking.bookingReference}? Seats will be released.`)) return;
    this.clearAlerts();

    this.bookingService.cancelBooking(booking.bookingId).subscribe({
      next: (res) => {
        this.successMessage = res.message || 'Booking cancelled.';
        booking.status = 'Cancelled';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Failed to cancel booking.';
        this.cdr.markForCheck();
      }
    });
  }
}
