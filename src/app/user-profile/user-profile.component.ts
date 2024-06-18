// src/app/user-profile/user-profile.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';

import { FetchApiDataService } from '../fetch-api-data.service';
import { FavoriteMoviesService } from '../favorite-movies.service';
import { Subscription } from 'rxjs';

import { Movie } from '../types/movie.interface';

interface FavoriteMovie extends Movie {
  id: string;
  title: string;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  // providers: [DatePipe]
})
export class UserProfileComponent implements OnInit, OnDestroy {
  userData: any = {};
  favoriteMovieIds: any[] = []; // array to store favorite movie IDs
  movies: any[] = [];
  favoriteMoviesData: any[] = []; // array to store favorite movie data (objects)
  private subscription: Subscription = new Subscription();
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

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

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

  getMovieByTitle(movieTitle: string): void {
    this.fetchApiData.getMovieByTitle(movieTitle).subscribe(
      (res: any) => {
        console.log(
          'no data returned from server for movie title:',
          movieTitle
        );
        if (res.body === null) {
          console.log(
            'no data returned from server for movie title:',
            movieTitle
          );
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
        this.formatBirthdayAndSetUserData(res.body);
    if (Array.isArray(this.userData.FavoriteMovieIds)) {
      const favoriteMovies = this.mapAndFilterFavoriteMovieIds(this.userData.FavoriteMoviesIds);
      this.favoriteMoviesService.updateFavoriteMovies(favoriteMovies);
    }
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
          this.formatBirthdayAndSetUserData(res.body);
    if (Array.isArray(this.userData.FavoriteMoviesIds)) {
      const favoriteMovies = this.mapAndFilterFavoriteMovieIds(this.userData.FavoriteMoviesIds);
      this.favoriteMoviesService.updateFavoriteMovies(favoriteMovies);
    }
        });
    }
  }

  removeFromFavorite(movie: Movie): void {
    this.fetchApiData
      .deleteFavoriteMovie(this.userData.Username, movie._id)
      .subscribe(
        () => {
          const updatedFavoriteMoviesIds = this.favoriteMoviesData.filter(m => m._id !== movie._id);
          const updatedFavoriteMovies = this.mapAndFilterFavoriteMovieIds(updatedFavoriteMoviesIds);
          this.favoriteMoviesService.updateFavoriteMovies(updatedFavoriteMovies);
        },
        (err: any) => {
          console.error(err);
        }
      );
  }

  // logout(): void {
  //   localStorage.removeItem('currentUser');
  //   localStorage.removeItem('token');
  //   this.router.navigate(['welcome']);
  // }
}
