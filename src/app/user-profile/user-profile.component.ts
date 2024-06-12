import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';
import { FavoriteMoviesService } from '../favorite-movies.service';

import { Movie } from '../types/movie.interface';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  // providers: [DatePipe]
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = []; // array to store favorite movie IDs
  movies: any[] = [];
  favoriteMoviesData: any[] = []; // array to store favorite movie data

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

  // ngOnInit(): void {
  //   if (this.userData && this.userData.Username) {
  //     this.getUser();
  //     this.getFavoriteMoviesFromServer();
  //   }
  // }

  ngOnInit(): void {
    if (this.userData && this.userData.Username) {
      this.getUser();
      // Get favorite movies from the service
      this.favoriteMoviesData = this.favoriteMoviesService.getFavMovies(this.userData.FavoriteMovies);
      console.log(this.favoriteMoviesData);
    }
  }
  
  getFavoriteMoviesFromServer(): void {
    this.fetchApiData.getFavoriteMovies(this.userData.Username).subscribe(
      (res: any) => {
        console.log('Response body:', res.body); // Log the entire response
        this.favoriteMovies = res.body; // assuming this is an array of movie IDs
        this.favoriteMoviesData = this.movies.filter(movie => this.favoriteMovies.includes(movie._id));
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  getMovieByTitle(movieTitle: string): void {
    this.fetchApiData.getMovieByTitle(movieTitle).subscribe(
      (res: any) => {
        console.log('no data returned from server for movie title:', movieTitle);
        if (res.body === null) {
          console.log('no data returned from server for movie title:', movieTitle);
        } else {
          console.log('Movie data:', res.body);
          this.favoriteMoviesData.push(res.body);
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData.Username, this.userData).subscribe(
      (res: any) => {
        const data = res.body;
        if (data && data.Birthday) {
          let date = new Date(data.Birthday);
          data.Birthday = date.toISOString().slice(0, 10);
        }
        this.userData = {
          ...data,
          id: res._id,
          password: this.userData.password,
          token: this.userData.token,
        };
        localStorage.setItem('currentUser', JSON.stringify(this.userData));
        this.getFavoriteMoviesFromServer(); // Fetch the updated list of favorite movies
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  resetUser(): void {
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }
  backToMovie(): void {
    this.router.navigate(['movies']);
  }

  getUser(): void {
    if (this.userData.Username) {
      this.fetchApiData
        .getUser(this.userData.Username)
        .subscribe((res: any) => {
          const data = res.body;
          if (data && data.Birthday) {
            let date = new Date(data.Birthday);
            data.Birthday = date.toISOString().slice(0, 10);
          }
          this.userData = {
            ...data,
            id: res._id,
            password: this.userData.password,
            token: this.userData.token,
          };
          localStorage.setItem('currentUser', JSON.stringify(this.userData));
        });
    }
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData
      .deleteFavoriteMovie(this.userData.Username, movie.title)
      .subscribe(
        (res: any) => {
          this.favoriteMoviesService.updateFavoriteMovies(movie._id);
          this.getFavoriteMoviesFromServer();
        },
        (err: any) => {
          console.error(err);
        }
      );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }
}
