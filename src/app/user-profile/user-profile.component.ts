// src/app/user-profile/user-profile.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';
import { FavoriteMoviesService } from '../favorite-movies.service';
import { Subscription } from 'rxjs';

import { Movie } from '../types/movie.interface';

/**
 * Represents a favorite movie which extends the Movie interface.
 */
interface FavoriteMovie extends Movie {
  id: string;    // The ID of the favorite movie.
  title: string; // The title of the favorite movie.
}

/**
 * UserProfileComponent displays and manages the user's profile,
 * including fetching user data and managing favorite movies.
 *
 * @export
 * @class UserProfileComponent
 * @implements {OnInit}
 * @implements {OnDestroy}
 */
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userData: any = {};              // Holds the user's data.
  favoriteMovieIds: any[] = [];    // Array to store favorite movie IDs.
  movies: any[] = [];              // Stores the list of movies.
  favoriteMoviesData: any[] = [];  // Array to store favorite movie data (objects).
  private subscription: Subscription = new Subscription(); // Subscription object to manage observables.

  /**
   * Constructs the UserProfileComponent.
   *
   * @param {FetchApiDataService} fetchApiData - Service to fetch data from the API.
   * @param {Router} router - Router for navigation.
   * @param {FavoriteMoviesService} favoriteMoviesService - Service to manage favorite movies.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    private favoriteMoviesService: FavoriteMoviesService
  ) {
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (this.userData && this.userData.Birthday) {
      let date = new Date(this.userData.Birthday);
      this.userData.Birthday = date.toISOString().slice(0, 10);
      localStorage.setItem('currentUser', JSON.stringify(this.userData));
    }
  }

  /**
   * Initializes the component, fetching user data and subscribing to favorite movies updates.
   */
  ngOnInit(): void {
    if (this.userData && this.userData.Username) {
      this.getUser();
      this.subscription = this.favoriteMoviesService
        .getFavoriteMoviesObservable()
        .subscribe((movies) => {
          this.favoriteMoviesData = movies
            .map((fav: { id: string; title: string; }) => {
              const movie = this.favoriteMoviesService
                .getAllMovies()
                .find((m) => m._id === fav.id);
              return movie ? { ...movie, ...fav } : undefined;
            })
            .filter(
              (movie: { id: string; title: string; } | undefined): movie is FavoriteMovie =>
                movie !== null && movie !== undefined
            );
        });
    }
  }

  /**
   * Cleans up the component, unsubscribing from observables.
   */
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Formats the birthday field and updates the user data.
   *
   * @param {*} data - The user data to format and set.
   */
  formatBirthdayAndSetUserData(data: any): void {
    if (data && data.Birthday) {
      let date = new Date(data.Birthday);
      data.Birthday = date.toISOString().slice(0, 10);
    }
    this.userData = {
      ...data,
      id: data._id,
      password: this.userData.password,
      token: this.userData.token,
    };
    localStorage.setItem('currentUser', JSON.stringify(this.userData));
  }

  /**
   * Maps and filters the favorite movie IDs to get detailed movie objects.
   *
   * @param {string[]} favoriteMovieIds - Array of favorite movie IDs.
   * @returns {FavoriteMovie[]} Array of favorite movie objects.
   */
  mapAndFilterFavoriteMovieIds(favoriteMovieIds: string[]): FavoriteMovie[] {
    return favoriteMovieIds
      .map((id: string) => {
        const movie = this.favoriteMoviesService
          .getAllMovies()
          .find((m: Movie) => m._id === id);
        return movie ? { ...movie, id, title: movie.Title } as FavoriteMovie : undefined;
      })
      .filter((movie: FavoriteMovie | undefined): movie is FavoriteMovie => movie !== undefined);
  }

  /**
   * Fetches a movie by its title and adds it to the favorite movies data.
   *
   * @param {string} movieTitle - The title of the movie to fetch.
   */
  getMovieByTitle(movieTitle: string): void {
    this.fetchApiData.getMovieByTitle(movieTitle).subscribe(
      (res: any) => {
        console.log('Movie data:', res.body);
        if (res.body) {
          this.favoriteMoviesData.push(res.body);
        } else {
          console.log('No data returned from server for movie title:', movieTitle);
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  /**
   * Updates the user data and favorite movies.
   */
  updateUser(): void {
    this.fetchApiData.editUser(this.userData.Username, this.userData).subscribe(
      (res: any) => {
        const data = res.body;
        this.formatBirthdayAndSetUserData(res.body);
        if (Array.isArray(this.userData.FavoriteMoviesIds)) {
          const favoriteMovies = this.mapAndFilterFavoriteMovieIds(this.userData.FavoriteMoviesIds);
          this.favoriteMoviesService.updateFavoriteMovies(favoriteMovies);
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  /**
   * Resets the user data to the initial state.
   */
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  /**
   * Navigates back to the movie view.
   */
  backToMovie(): void {
    this.router.navigate(['movies']);
  }

  /**
   * Fetches the current user's data from the server.
   */
  getUser(): void {
    if (this.userData.Username) {
      this.fetchApiData
        .getUser(this.userData.Username)
        .subscribe((res: any) => {
          const data = res.body;
          this.formatBirthdayAndSetUserData(res.body);
          if (Array.isArray(this.userData.FavoriteMoviesIds)) {
            const favoriteMovies = this.mapAndFilterFavoriteMovieIds(this.userData.FavoriteMoviesIds);
            this.favoriteMoviesService.updateFavoriteMovies(favoriteMovies);
          }
        });
    }
  }

  /**
   * Removes a movie from the user's favorite list.
   *
   * @param {Movie} movie - The movie to remove from favorites.
   */
  removeFromFavorite(movie: Movie): void {
    this.fetchApiData
      .deleteFavoriteMovie(this.userData.Username, movie._id)
      .subscribe(
        () => {
          const updatedFavoriteMovies = this.favoriteMoviesData.filter(m => m._id !== movie._id);
          this.favoriteMoviesService.updateFavoriteMovies(updatedFavoriteMovies);
        },
        (err: any) => {
          console.error(err);
        }
      );
  }

}
