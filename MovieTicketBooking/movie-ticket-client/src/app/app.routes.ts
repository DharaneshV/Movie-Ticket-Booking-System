import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { MovieListComponent } from './features/movies/movie-list/movie-list.component';
import { MovieDetailComponent } from './features/movies/movie-detail/movie-detail.component';
import { ShowListComponent } from './features/shows/show-list/show-list.component';
import { SeatSelectionComponent } from './features/booking/seat-selection/seat-selection.component';
import { MyBookingsComponent } from './features/booking/my-bookings/my-bookings.component';
import { AdminDashboardComponent } from './features/admin/admin-dashboard/admin-dashboard.component';
import { authGuard, customerGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'movies', pathMatch: 'full' },
  { path: 'movies', component: MovieListComponent },
  { path: 'movies/:id', component: MovieDetailComponent },
  { path: 'shows', component: ShowListComponent },
  { path: 'book/:showId', component: SeatSelectionComponent, canActivate: [customerGuard] },
  { path: 'my-bookings', component: MyBookingsComponent, canActivate: [customerGuard] },
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: Register },
  { path: '**', redirectTo: 'movies' }
];
