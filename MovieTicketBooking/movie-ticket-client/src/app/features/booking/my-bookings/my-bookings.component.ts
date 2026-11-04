import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading: boolean = true;
  errorMessage: string = '';
  actionMessage: string = '';
  cancellingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadMyBookings();
  }

  loadMyBookings(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.bookingService.getMyBookings().subscribe({
      next: (data) => {
        this.bookings = data || [];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Failed to load your bookings.';
          this.cdr.markForCheck();
        }
      });
  }

  onCancelBooking(booking: Booking): void {
    const confirmed = confirm(
      `Are you sure you want to cancel booking ${booking.bookingReference} for "${booking.movieTitle}"? Your seats will be released.`
    );
    if (!confirmed) return;

    this.cancellingId = booking.bookingId;
    this.actionMessage = '';
    this.cdr.markForCheck();

    this.bookingService.cancelBooking(booking.bookingId).subscribe({
      next: (res) => {
        this.cancellingId = null;
        this.actionMessage = res.message || 'Booking cancelled successfully.';
        booking.status = 'Cancelled';
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.cancellingId = null;
        this.cdr.markForCheck();
        alert(err.error?.message || 'Failed to cancel booking.');
      }
    });
  }
}
