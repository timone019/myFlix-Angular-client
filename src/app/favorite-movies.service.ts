import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FetchApiDataService } from './fetch-api-data.service';
import { forkJoin } from 'rxjs';

import { Movie } from './types/movie.interface';

interface FavoriteMovie {
  id: string;
  title: string;
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteMoviesService {
  private favoriteMovies = new BehaviorSubject<Movie[]>([]);
  private allMovies: Movie[] = [];

  constructor(private fetchApiDataService: FetchApiDataService) {
    this.fetchApiDataService.getAllMovies().subscribe(movies => {
      this.setAllMovies(movies);
    });
  } // Inject the FetchapisdataService

  // method to set all movies
  setAllMovies(movies: Movie[]): void {
    this.allMovies = movies;
  }

  getFavMovies(userFavMovieIds: string[]): Movie[] {
    console.log('allMovies:', this.allMovies);
    console.log('userFavMovieIds:', userFavMovieIds);
    return this.allMovies.filter(movie => userFavMovieIds.includes(movie._id));
  }
  // method to get all movies
  getAllMovies(): Movie[] {
    return this.allMovies;
  }
  getFavoriteMovies(): Movie[] {
    return this.favoriteMovies.getValue();
  }

  addFavoriteMovie(movie: Movie): void {
    const currentFavorites = this.favoriteMovies.getValue();
    this.favoriteMovies.next([...currentFavorites, movie]);
  }

  removeFavoriteMovie(movieId: string): void {
    const currentFavorites = this.favoriteMovies.getValue();
    const updatedFavorites = currentFavorites.filter(
      (movie) => movie._id !== movieId
    );
    this.favoriteMovies.next(updatedFavorites);
  }
  updateFavoriteMovies(favoriteMovies: FavoriteMovie[]): void {
    const movieObservables = favoriteMovies.map(favoriteMovie => {
      return this.fetchApiDataService.getMovieByTitle(favoriteMovie.title);
    });
  
    forkJoin(movieObservables).subscribe(fullMovies => {
      this.favoriteMovies.next(fullMovies);
    });
  }
}