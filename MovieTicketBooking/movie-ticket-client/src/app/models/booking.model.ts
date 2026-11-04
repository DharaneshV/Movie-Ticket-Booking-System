export interface Booking {
  bookingId: number;
  bookingReference: string;
  showId: number;
  movieTitle: string;
  theatreName: string;
  screenName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bookingDate: string;
  totalAmount: number;
  status: 'Confirmed' | 'Cancelled';
  seats: string[];
}

export interface CreateBookingRequest {
  showId: number;
  customerPhone: string;
  seatIds: number[];
}

