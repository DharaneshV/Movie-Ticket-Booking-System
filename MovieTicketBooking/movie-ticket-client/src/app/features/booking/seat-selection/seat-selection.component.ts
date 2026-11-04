import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ShowService } from '../../../core/services/show.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth';
import { Show } from '../../../models/show.model';
import { ShowSeat } from '../../../models/seat.model';
import { Booking } from '../../../models/booking.model';

@Component({
  selector: 'app-seat-selection',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './seat-selection.component.html',
  styleUrls: ['./seat-selection.component.css']
})
export class SeatSelectionComponent implements OnInit {
  showId!: number;
  show?: Show;
  seats: ShowSeat[] = [];
  groupedSeats: { [row: string]: ShowSeat[] } = {};
  seatRows: string[] = [];

  selectedSeatIds: Set<number> = new Set<number>();
  customerPhone: string = '';

  isLoading: boolean = true;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  confirmedBooking?: Booking;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private showService: ShowService,
    private bookingService: BookingService,
    public authService: AuthService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('showId');
    if (idParam) {
      this.showId = Number(idParam);
      this.loadShowAndSeats();
    }
  }

  loadShowAndSeats(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.markForCheck();

    this.showService.getShowById(this.showId).subscribe({
      next: (showData) => {
        this.show = showData;
        this.fetchSeats();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Show details could not be loaded.';
        this.cdr.markForCheck();
      }
    });
  }

  fetchSeats(): void {
    this.showService.getShowSeats(this.showId).subscribe({
      next: (seatData) => {
        this.seats = seatData || [];
        this.groupSeatsByRow();
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Failed to load seating arrangement.';
        this.cdr.markForCheck();
      }
    });
  }

  groupSeatsByRow(): void {
    this.groupedSeats = {};
    for (const seat of this.seats) {
      const row = seat.rowName || 'A';
      if (!this.groupedSeats[row]) {
        this.groupedSeats[row] = [];
      }
      this.groupedSeats[row].push(seat);
    }

    // Sort rows alphabetically
    this.seatRows = Object.keys(this.groupedSeats).sort();

    // Sort seats in each row by seatNumber
    for (const row of this.seatRows) {
      this.groupedSeats[row].sort((a, b) => a.seatNumber - b.seatNumber);
    }
  }

  isSeatSelected(seatId: number): boolean {
    return this.selectedSeatIds.has(seatId);
  }

  toggleSeat(seat: ShowSeat): void {
    if (seat.status === 'Booked') return;

    if (this.selectedSeatIds.has(seat.seatId)) {
      this.selectedSeatIds.delete(seat.seatId);
    } else {
      if (this.selectedSeatIds.size >= 10) {
        alert('You can select up to 10 seats per booking.');
        return;
      }
      this.selectedSeatIds.add(seat.seatId);
    }
    this.cdr.markForCheck();
  }

  getSelectedSeats(): ShowSeat[] {
    return this.seats.filter((s) => this.selectedSeatIds.has(s.seatId));
  }

  getTotalPrice(): number {
    const selected = this.getSelectedSeats();
    return selected.reduce((sum, s) => sum + (s.price || this.show?.ticketPrice || 0), 0);
  }

  onConfirmBooking(): void {
    this.errorMessage = '';

    if (this.selectedSeatIds.size === 0) {
      this.errorMessage = 'Please select at least one seat.';
      this.cdr.markForCheck();
      return;
    }

    if (!this.customerPhone.trim()) {
      this.errorMessage = 'Please provide a contact phone number.';
      this.cdr.markForCheck();
      return;
    }

    this.isSubmitting = true;
    this.cdr.markForCheck();

    const request = {
      showId: this.showId,
      customerPhone: this.customerPhone.trim(),
      seatIds: Array.from(this.selectedSeatIds)
    };

    this.bookingService.createBooking(request).subscribe({
      next: (booking) => {
        this.isSubmitting = false;
        this.confirmedBooking = booking;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isSubmitting = false;
        this.errorMessage =
          err.error?.message ||
          err.error?.title ||
          'Booking failed. One or more selected seats may have already been booked. Please refresh and try again.';
        this.cdr.markForCheck();
      }
    });
  }

  onReset(): void {
    this.selectedSeatIds.clear();
    this.confirmedBooking = undefined;
    this.loadShowAndSeats();
  }
}
