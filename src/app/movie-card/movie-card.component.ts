// src/app/movie-card/movie-card.component.ts
import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  movies: any[] = [];
  constructor(public fetchApiData: FetchApiDataService) {}

  ngOnInit(): void {
    this.getMovies();
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      this.movies = resp;
      console.log(this.movies);
      return this.movies;
    });
  }

  toggleFavorite(movie: any) {
    movie.isFavorite = !movie.isFavorite;
    movie.heartActive = movie.isFavorite; 

    let user = localStorage.getItem('user');
    let username = user ? JSON.parse(user).Username : null;

    if (!username) {
      console.error('No user found');
      return;
    }
  
    if (movie.isFavorite) {
      // If the movie was favorited, add it to the user's favorite movie list
      this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe(() => {
        console.log(`Added ${movie.Title} to favorites`);
      });
    } else {
      // If the movie was unfavorited, remove it from the user's favorite movie list
      this.fetchApiData.deleteFavoriteMovie(username, movie._id).subscribe(() => {
        console.log(`Removed ${movie.Title} from favorites`);
      });
    }
  }
}