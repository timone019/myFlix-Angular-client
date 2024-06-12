// src/app/types/user.interface.ts
// import { Movie } from './movie.interface';

export interface User {
  _id: string;
  FullName: string;

  Username: string;
  Password: string;
  Email: string;
  Birthday: Date;
  // FavoriteMovies: Movie[];
  FavoriteMovies: string[];
}
