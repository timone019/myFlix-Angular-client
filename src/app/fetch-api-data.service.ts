import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://mymovies-8b73c95d0ae4.herokuapp.com/';
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  private token: string;

  private getHeaders() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
  
    if (this.token) {
      headers = headers.set('Authorization', 'Bearer ' + this.token);
    }
  
    return headers;
  }
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('token') || '';
  }

  private extractResponseData(res: any): any {
    const body = res.body;
    return body || {};
  }

  // Making the api call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'users/register', userDetails).pipe(
      map((res: any) => {
        // Store the token in local storage
        localStorage.setItem('token', res.token);
        return res;
      }),
      catchError(this.handleError)
    );
  }
  // User login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      map((res: any) => {
        // Store the token in local storage
        localStorage.setItem('token', res.token);
        return res;
      }),
      catchError(this.handleError)
    );
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(
        map((response) => response.body || {}),
        catchError(this.handleError)
      );
  }

  // Get one movie
  public getOneMovie(id: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + id, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Get director
  public getDirector(id: string): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + id, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Get genre
  public getGenre(id: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + id, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Get user
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Get favorite movies for a user
  public getFavoriteMovies(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username + '/movies', {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Add a movie to favorite Movies
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(
        apiUrl + 'users/' + username + '/movies/' + movieId,
        {},
        {
          headers: this.getHeaders(),
          observe: 'response',
        }
      )
      .pipe(catchError(this.handleError));
  }

  // Edit user
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + username, userDetails, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Delete user
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }

  // Delete a movie from the favorite movies
  public deleteFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieId, {
        headers: this.getHeaders(),
        observe: 'response',
      })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Something bad happened; please try again later.';

    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('Some error occurred:', error.error.message);
    } else if (error instanceof HttpErrorResponse) {
      // The backend returned an unsuccessful response code.
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }

     // Log the custom error message
  console.error(errorMessage);
  
    return throwError(new Error(errorMessage));
  }
}
