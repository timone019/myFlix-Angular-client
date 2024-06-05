// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from './../fetch-api-data.service';
import { FavoriteMoviesService } from '../favorite-movies.service';

interface User {
  Username: string;
  Password: string;
  Email: string;
  Birthday: Date;
  FullName: string;
  FavoriteMovies: string[];
}

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  user: any = {};
  favorites: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    private favoriteMoviesService: FavoriteMoviesService
  ) {}

  ngOnInit(): void {
    // this.favoriteMoviesService.favoriteMovies$.subscribe((movies: any[]) => {
    //   this.favorites = movies;
    // });
    this.getUser();
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
      return this.movies;
    });
  }

  updateFavoriteStatus(): void {
    this.movies.forEach(movie => {
      movie.isFavorite = this.favorites.includes(movie._id);
      movie.heartActive = movie.isFavorite;
    });
  }
  
  toggleFavorite(selectedMovie: any) {
  // selectedMovie.isFavorite = !movie.isFavorite;
  // movie.heartActive = movie.isFavorite;

  const currentUser: User | null = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const username = currentUser ? currentUser.Username : '';

  console.log('currentUser:', currentUser);
  console.log('username:', username);

  if (!username) {
    console.error('No user found');
    return;
  }

  if (currentUser && currentUser.FavoriteMovies.includes(selectedMovie)) {
    // If the movie was favorited, add it to the user's favorite movie list
    this.fetchApiData.addFavoriteMovie(username, selectedMovie).subscribe(() => {
      console.log(`Added ${selectedMovie} to favorites`);
      this.favorites.push(selectedMovie); // this is adding movie to local storage favorite movie list causing dupes, need to check 
      this.favoriteMoviesService.updateFavoriteMovies(this.favorites);
    });
  } else {
    // If the movie was unfavorited, remove it from the user's favorite movie list
    this.fetchApiData.deleteFavoriteMovie(username, selectedMovie).subscribe(() => {
      console.log(`Removed ${selectedMovie} from favorites`);
      const index = this.favorites.indexOf(selectedMovie);
      if (index > -1) {
        this.favorites.splice(index, 1);
      }
      this.favoriteMoviesService.updateFavoriteMovies(this.favorites);
    });
  }
}
  
  
  // openGenreModal(movie: Movie): void {
  //   this.dialog.open(GenreComponent, {
  //     data: { movie: movie }
  //   });
  // }
  
  // openDirectorModal(movie: Movie): void {
  //   this.dialog.open(DirectorInfoComponent, {
  //     data: { movie: movie }
  //   });
  // }
  
  // openSynopsisModal(movie: Movie): void {
  //   this.dialog.open(SynopsisComponent, {
  //     data: { movie: movie }
  //   });
  // }

}