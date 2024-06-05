import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteMoviesService {
  private favoriteMoviesSource = new BehaviorSubject<any[]>([]);
  favoriteMovies$ = this.favoriteMoviesSource.asObservable();

  updateFavoriteMovies(movies: any[]): void {
    this.favoriteMoviesSource.next(movies);
  }
}