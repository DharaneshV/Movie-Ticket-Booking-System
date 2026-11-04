export interface Seat {
  seatId: number;
  screenId: number;
  rowName: string;
  seatNumber: number;
  seatType: string;
}

export interface ShowSeat {
  seatId: number;
  rowName: string;
  seatNumber: number;
  seatLabel: string;
  seatType: string;
  price: number;
  status: 'Available' | 'Booked';
}

export interface BulkCreateSeatsRequest {
  screenId: number;
  rows: string[];
  seatsPerRow: number;
  seatType: string;
}

