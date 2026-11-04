export interface Show {
  showId: number;
  movieId: number;
  movieTitle: string;
  screenId: number;
  screenName: string;
  startTime: string;
  endTime: string;
  ticketPrice: number;
}

export interface CreateShowRequest {
  movieId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  ticketPrice: number;
}

export interface UpdateShowRequest {
  movieId: number;
  screenId: number;
  startTime: string;
  endTime: string;
  ticketPrice: number;
}

