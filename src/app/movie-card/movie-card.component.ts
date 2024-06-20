// src/app/movie-card/movie-card.component.ts

import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from './../fetch-api-data.service';
import { FavoriteMoviesService } from '../favorite-movies.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GenreComponent } from '../genre/genre.component';
import { DirectorInfoComponent } from '../director-info/director-info.component';
import { SynopsisComponent } from '../synopsis/synopsis.component';
import { MatSnackBar } from '@angular/material/snack-bar';

import { User } from '../types/user.interface';
import { Movie } from '../types/movie.interface';

/**
 * MovieCardComponent is responsible for displaying movie cards, handling user interactions
 * such as adding/removing movies from favorites, and opening modals for genre, director, and synopsis.
 *
 * @export
 * @class MovieCardComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  /**
   * Stores the list of movies.
   *
   * @type {Movie[]}
   */
  movies: Movie[] = [];
  /**
   * Holds the user's data.
   *
   * @type {*}
   */
  user: any = {};
  /**
   * Stores the IDs of the user's favorite movies.
   *
   * @type {string[]}
   */
  favorites: string[] = [];
  /**
   * Stores the list of genres.
   *
   * @type {any[]}
   */
  genres: any[] = [];
  /**
   * Stores the list of directors.
   *
   * @type {any[]}
   */
  director: any[] = [];

  /**
   * Creates an instance of MovieCardComponent.
   *
   * @param {FetchApiDataService} fetchApiData - Service to fetch data from the API.
   * @param {MatDialog} dialog - Service to open Angular Material dialogs.
   * @param {MatSnackBar} snackBar - Service to show snack bar notifications.
   * @param {Router} router - Router for navigation.
   * @param {FavoriteMoviesService} favoriteMoviesService - Service to manage favorite movies.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private favoriteMoviesService: FavoriteMoviesService
  ) {}

  /**
   * Initializes the component, fetching user data and movies.
   */
  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

  /**
   * Fetches the current user's data and their favorite movies.
   */
  getUser(): void {
    const { Username } = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    if (!Username) {
      console.error('No user found');
      return;
    }

    this.fetchApiData.getUser(Username).subscribe((res: any) => {
      this.user = res.body;
      if (Array.isArray(this.user.FavoriteMovies)) {
        this.favorites = this.user.FavoriteMovies;
        this.favoriteMoviesService.updateFavoriteMovies(
          this.favorites.map((id) => ({ id, title: '' }))
        );
      }
      this.getMovies();
    });
  }

  /**
   * Fetches all movies and updates their favorite status.
   */
  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.updateFavoriteStatus();
      this.favoriteMoviesService.setAllMovies(this.movies); // set all movies in the service
      return this.movies;
    });
  }

  /**
   * Updates the favorite status of the movies.
   */
  updateFavoriteStatus(): void {
    this.movies.forEach((movie) => {
      movie.isFavorite = this.favorites.includes(movie._id);
      movie.heartActive = movie.isFavorite;
    });
  }

  /**
   * Toggles the favorite status of a selected movie.
   *
   * @param {string} selectedMovie - The ID of the selected movie.
   */
  toggleFavorite(selectedMovie: string): void {
    const currentUser: User | null = JSON.parse(
      localStorage.getItem('currentUser') || '{}'
    );
    const username = currentUser?.Username || '';
    if (!username) {
      console.error('No user found');
      return;
    }

    const isFavorite =
      currentUser?.FavoriteMovies.includes(selectedMovie) || false;
    let movie = this.movies.find((movie) => movie._id === selectedMovie);
    if (!movie) {
      console.log('Movie not found');
      return;
    }

    let movieTitle = movie.Title;

    if (!isFavorite) {
      this.fetchApiData
        .addFavoriteMovie(username, selectedMovie)
        .subscribe(() => {
          this.updateUserFavorites(
            currentUser,
            selectedMovie,
            movieTitle,
            true
          );
          this.snackBar.open(
            `Added movie ${movieTitle} to favorites`,
            'Close',
            { duration: 2000 }
          );
        });
    } else {
      this.fetchApiData
        .deleteFavoriteMovie(username, selectedMovie)
        .subscribe(() => {
          this.updateUserFavorites(
            currentUser,
            selectedMovie,
            movieTitle,
            false
          );
          this.snackBar.open(
            `Removed movie ${movieTitle} from favorites`,
            'Close',
            { duration: 2000 }
          );
        });
    }
  }

  /**
   * Updates the user's favorite movies in local storage and the favorite movies service.
   *
   * @param {User | null} currentUser - The current user object.
   * @param {string} selectedMovie - The ID of the selected movie.
   * @param {string} movieTitle - The title of the selected movie.
   * @param {boolean} isFavorite - The favorite status of the selected movie.
   */
  updateUserFavorites(
    currentUser: User | null,
    selectedMovie: string,
    movieTitle: string,
    isFavorite: boolean
  ): void {
    if (currentUser) {
      if (!Array.isArray(currentUser.FavoriteMovies)) {
        currentUser.FavoriteMovies = [];
      }

      let favoriteMovies = currentUser.FavoriteMovies.filter(
        (movie) => movie !== null
      );

      if (isFavorite) {
        favoriteMovies.push(selectedMovie);
      } else {
        const index = favoriteMovies.indexOf(selectedMovie);
        if (index > -1) {
          favoriteMovies.splice(index, 1);
        }
      }
      currentUser.FavoriteMovies = favoriteMovies.filter(
        (movie) => movie !== null
      );
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      this.favoriteMoviesService.updateFavoriteMovies(
        favoriteMovies.map((id) => ({ id, title: movieTitle }))
      );
      const movie = this.movies.find((movie) => movie._id === selectedMovie);
      if (movie) {
        movie.isFavorite = isFavorite;
        movie.heartActive = isFavorite;
      }
    }
  }

  /**
   * Opens the genre modal with the selected movie's genre data.
   *
   * @param {any} movie - The selected movie object.
   */
  openGenreModal(movie: any): void {
    this.dialog.open(GenreComponent, {
      data: { genre: movie.Genre },
    });
  }

  /**
   * Opens the director info modal with the selected movie's director data.
   *
   * @param {any} movie - The selected movie object.
   */
  openDirectorModal(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director: movie.Director },
    });
  }

  /**
   * Opens the synopsis modal with the selected movie's data.
   *
   * @param {any} movie - The selected movie object.
   */
  openSynopsisModal(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie },
      width: '600px',
    });
  }

  /**
   * Navigates to the user's profile page.
   */
  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
