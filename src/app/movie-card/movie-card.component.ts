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

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  movies: Movie[] = [];
  user: any = {};
  favorites: string[] = [];
  genres: any[] = [];
  director: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private router: Router,
    private favoriteMoviesService: FavoriteMoviesService
  ) {}

  ngOnInit(): void {
    this.getUser();
    this.getMovies();
  }

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

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      this.updateFavoriteStatus();
      this.favoriteMoviesService.setAllMovies(this.movies); // set all movies in the service
      return this.movies;
    });
  }

  updateFavoriteStatus(): void {
    this.movies.forEach((movie) => {
      movie.isFavorite = this.favorites.includes(movie._id);
      movie.heartActive = movie.isFavorite;
    });
  }

  toggleFavorite(selectedMovie: string) {
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

  updateUserFavorites(
    currentUser: User | null,
    selectedMovie: string,
    movieTitle: string,
    isFavorite: boolean
  ) {
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

  openGenreModal(movie: any): void {
    this.dialog.open(GenreComponent, {
      data: { genre: movie.Genre },
    });
  }

  openDirectorModal(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director: movie.Director },
    });
  }

  openSynopsisModal(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie },
      width: '600px',
    });
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }
}
