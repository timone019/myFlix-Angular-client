import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';


/** Declaring the api url that will provide data for the client app */
const apiUrl = 'https://move-api-kw8t.onrender.com/';

/**
 * Service to fetch data from the movie API.
 */
@Injectable({
  providedIn: 'root',
})

export class FetchApiDataService {

   /**
   * Retrieves headers for HTTP requests, including Authorization token if available.
   * @returns HttpHeaders object with Content-Type and Authorization if token exists.
   */
  private getHeaders() {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    const token = localStorage.getItem('token');
  
    if (token) {
      headers = headers.set('Authorization', 'Bearer ' + token);
    }
  
    return headers;
  }

    /**
   * Constructs options for HTTP requests including headers.
   * @returns RequestOptions object with headers and observe response.
   */
  private getOptions() {
    return {
      headers: this.getHeaders(),
      observe: 'response' as const
    };
  }

  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {}

  private extractResponseData(res: any): any {
    const body = res.body;
    return body || {};
  }

    /**
   * Makes an API call to register a new user.
   * @param userDetails User details for registration.
   * @returns Observable with registration response.
   */
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

   /**
   * Logs in an existing user.
   * @param userDetails User details to login.
   * @returns Observable with login response.
   */
public userLogin(userDetails: any): Observable<any> {
  return this.http.post(apiUrl + 'login', userDetails).pipe(
    map((res: any) => {
      // Store the token and user's data in local storage
      localStorage.setItem('token', res.token);
      localStorage.setItem('currentUser', JSON.stringify(res.user));
      return res;
    }),
    catchError(this.handleError)
  );
}

 /**
   * Retrieves all movies.
   * @returns Observable with list of movies.
   */
  public getAllMovies(): Observable<any> {
    return this.http
      .get(apiUrl + 'movies', this.getOptions())
      .pipe(
        map((response) => response.body || {}),
        catchError(this.handleError)
      );
  }


   /**
   * Retrieves a movie by its title.
   * @param title Title of the movie to retrieve.
   * @returns Observable with movie details.
   */
  public getMovieByTitle(title: string): Observable<any> {
    return this.http
      .get(apiUrl + 'movies/' + title, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves director details.
   * @param directorName Name of the director.
   * @returns Observable with director details.
   */
  public getDirector(directorName: string): Observable<any> {
    return this.http
      .get(apiUrl + 'directors/' + directorName, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves genre details.
   * @param name Name of the genre.
   * @returns Observable with genre details.
   */
  public getGenre(name: string): Observable<any> {
    return this.http
      .get(apiUrl + 'genres/' + name, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Retrieves user details.
   * @param username Username of the user.
   * @returns Observable with user details.
   */
  public getUser(username: string): Observable<any> {
    return this.http
      .get(apiUrl + 'users/' + username, this.getOptions())
      .pipe(catchError(this.handleError));
  }



  /**
   * Adds a movie to the user's favorite movies.
   * @param username Username of the user.
   * @param movieId ID of the movie to add to favorites.
   * @returns Observable with add favorite movie response.
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    return this.http
      .post(
        apiUrl + 'users/' + username + '/movies/' + movieId,
        {},
       this.getOptions()
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Edits user details.
   * @param username Username of the user.
   * @param userDetails New user details.
   * @returns Observable with edit user response.
   */
  public editUser(username: string, userDetails: any): Observable<any> {
    return this.http
      .put(apiUrl + 'users/' + username, userDetails, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user account.
   * @param username Username of the user to delete.
   * @returns Observable with delete user response.
   */
  public deleteUser(username: string): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username, this.getOptions())
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a movie from the user's favorite movies.
   * @param username Username of the user.
   * @param movieId ID of the movie to delete from favorites.
   * @returns Observable with delete favorite movie response.
   */

  public deleteFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    return this.http
      .delete(apiUrl + 'users/' + username + '/movies/' + movieId, this.getOptions())
      .pipe(catchError(this.handleError));
  }

    /**
   * Handles HTTP errors by logging and throwing a custom error message.
   * @param error HttpErrorResponse object representing the error.
   * @returns Observable that throws a custom error message.
   */
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
