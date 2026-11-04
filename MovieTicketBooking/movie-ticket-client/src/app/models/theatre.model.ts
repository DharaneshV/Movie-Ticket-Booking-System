export interface Theatre {
  theatreId: number;
  name: string;
  location: string;
}

export interface CreateTheatreRequest {
  name: string;
  location: string;
}

export interface UpdateTheatreRequest {
  name: string;
  location: string;
}
