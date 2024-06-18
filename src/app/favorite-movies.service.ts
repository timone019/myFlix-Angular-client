import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FetchApiDataService } from './fetch-api-data.service';

import { Movie } from './types/movie.interface';

interface FavoriteMovie {
  id: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteMoviesService {
  private favoriteMovies = new BehaviorSubject<FavoriteMovie[]>([]);
  private allMovies: Movie[] = [];

  constructor(private fetchApiDataService: FetchApiDataService) {}

  // method to set all movies
  setAllMovies(movies: Movie[]): void {
    this.allMovies = movies;
  }

  getFavMovies(userFavMovieIds: string[]): Movie[] {
    return this.allMovies.filter((movie) =>
      userFavMovieIds.includes(movie._id)
    );
  }
  // method to get all movies
  getAllMovies(): Movie[] {
    return this.allMovies;
  }
  public getFavoriteMoviesObservable(): Observable<FavoriteMovie[]> {
    return this.favoriteMovies.asObservable();
  }

  updateFavoriteMovies(favoriteMovies: FavoriteMovie[]): void {
    this.favoriteMovies.next(favoriteMovies);
  }
}
