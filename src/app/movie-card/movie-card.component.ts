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
// interface User {
//   Username: string;
//   Password: string;
//   Email: string;
//   Birthday: Date;
//   FullName: string;
//   FavoriteMovies: string[];
// }

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  favorites: any[] = [];
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
    const { Username } = JSON.parse(localStorage.getItem('currentUser') || '{}');
  
    if (!Username) {
      console.error('No user found');
      return;
    }
  
    this.fetchApiData.getUser(Username).subscribe((res: any) => {
      this.user = res.body
      console.log(this.user);
      if (Array.isArray(this.user.FavoriteMovies)) {
        this.favorites = this.user.FavoriteMovies;
        this.favoriteMoviesService.updateFavoriteMovies(this.favorites);
      }
      this.getMovies();
    });
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      this.updateFavoriteStatus();
      this.favoriteMoviesService.setAllMovies(this.movies); // set all movies in the service
      return this.movies;
    });
  }

  updateFavoriteStatus(): void {
    this.movies.forEach(movie => {
      movie.isFavorite = this.favorites.includes(movie._id);
      movie.heartActive = movie.isFavorite;
    });
  }
  
  toggleFavorite(selectedMovie: string) {
    const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser?.Username || '';
  
    if (!username) {
      console.error('No user found');
      return;
    }
  
    const isFavorite = currentUser?.FavoriteMovies.includes(selectedMovie) || false;
  
    // Find the movie in the movies array
  let movie = this.movies.find(movie => movie._id === selectedMovie);

  if (!movie) {
    console.log('Movie not found');
    return;
  }

  let movieTitle = movie.Title;

    if (!isFavorite) {
      this.fetchApiData.addFavoriteMovie(username, selectedMovie).subscribe(() => {
        this.updateUserFavorites(currentUser, selectedMovie, movieTitle, true);
        this.snackBar.open(`Added movie ${movieTitle} to favorites`, 'Close', { duration: 2000 });
      });
    } else {
      this.fetchApiData.deleteFavoriteMovie(username, selectedMovie).subscribe(() => {
        this.updateUserFavorites(currentUser, selectedMovie, movieTitle, false);
        this.snackBar.open(`Removed movie ${movieTitle} from favorites`, 'Close', { duration: 2000 });
      });
    }
  }
  
  updateUserFavorites(currentUser: User | null, selectedMovie: string, movieTitle: string, isFavorite: boolean) {
    if (currentUser) {
      // Ensure FavoriteMovies is an array
      if (!Array.isArray(currentUser.FavoriteMovies)) {
        currentUser.FavoriteMovies = [];
      }
  
      let favoriteMovies = currentUser.FavoriteMovies as unknown as {id: string, title: string}[];
  
      if (isFavorite) {
        favoriteMovies.push({id: selectedMovie, title: movieTitle});
      } else {
        const index = favoriteMovies.findIndex(movie => movie.id === selectedMovie);
        if (index > -1) {
          favoriteMovies.splice(index, 1);
        }
      }
      currentUser.FavoriteMovies = favoriteMovies.map(movie => movie.id); // Update the FavoriteMovies of currentUser
      localStorage.setItem('currentUser', JSON.stringify(currentUser)); // Update the currentUser in localStorage
      this.favoriteMoviesService.updateFavoriteMovies(favoriteMovies);
      const movie = this.movies.find(movie => movie._id === selectedMovie);
      if (movie) {
        movie.isFavorite = isFavorite; // Update the isFavorite property of the movie
        movie.heartActive = isFavorite; // Update the heartActive property of the movie
      }
      this.favoriteMoviesService.updateFavoriteMovies(favoriteMovies);
    }
  }

  
  openGenreModal(movie: any): void {
    this.dialog.open(GenreComponent, {
      data: { genre: movie.Genre }
    });
  }
  
  openDirectorModal(movie: any): void {
    this.dialog.open(DirectorInfoComponent, {
      data: { director: movie.Director }
    });
  }
  
  openSynopsisModal(movie: any): void {
    this.dialog.open(SynopsisComponent, {
      data: { movie },
      width: '600px'
    });
  }

  navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

}