import { Component, OnInit } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { FavoriteMoviesService } from '../favorite-movies.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
})
export class UserProfileComponent implements OnInit {
  userData: any = {};
  favoriteMovies: any[] = [];
  constructor(
    public fetchApiData: FetchApiDataService,
    public router: Router,
    private favoriteMoviesService: FavoriteMoviesService
  ) {
    this.userData = JSON.parse(localStorage.getItem('currentUser') || '{}');
  }

  ngOnInit(): void {
    if (this.userData && this.userData.Username) {
      this.getUser();
      this.favoriteMoviesService.favoriteMovies$.subscribe((movies: any[]) => {
        this.favoriteMovies = movies;
      });
    }
  }

  updateUser(): void {
    this.fetchApiData.editUser(this.userData.Username, this.userData).subscribe(
      (res: any) => {
        this.userData = {
          ...res,
          id: res._id,
          password: this.userData.password,
          token: this.userData.token,
        };
        localStorage.setItem('currentUser', JSON.stringify(this.userData));
        this.getFavoriteMovies();
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

  getFavoriteMovies(): void {
    if (this.userData.Username) {
      this.fetchApiData.getFavoriteMovies(this.userData.Username).subscribe(
        (res: any) => {
          this.favoriteMovies = res;
          this.favoriteMoviesService.updateFavoriteMovies(this.favoriteMovies);
        },
        (err: any) => {
          console.error(err);
        }
      );
    }
  }

  getUser(): void {
    if (this.userData.Username) {
      this.fetchApiData
        .getUser(this.userData.Username)
        .subscribe((res: any) => {
          this.userData = {
            ...res,
            id: res._id,
            password: this.userData.password,
            token: this.userData.token,
          };
          localStorage.setItem('currentUser', JSON.stringify(this.userData));
          this.getFavoriteMovies();
        });
    }
  }

  removeFromFavorite(movie: any): void {
    this.fetchApiData
      .deleteFavoriteMovie(this.userData.Username, movie.title)
      .subscribe(
        (res: any) => {
          this.userData.favoriteMovies = res.favoriteMovies;
          this.getFavoriteMovies();
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
