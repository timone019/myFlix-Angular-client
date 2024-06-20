// src/app/types/movie.interface.ts

/**
 * Interface representing a movie in the application.
 *
 * @export
 * @interface Movie
 */
export interface Movie {
  /**
   * Unique identifier for the movie.
   *
   * @type {string}
   */
  _id: string;

  /**
   * Title of the movie.
   *
   * @type {string}
   */
  Title: string;

  /**
   * Description of the movie.
   *
   * @type {string}
   */
  Description: string;

  /**
   * Genre of the movie, including name and description.
   *
   * @type {{ Name: string; Description: string }}
   */
  Genre: {
    /**
     * Name of the genre.
     *
     * @type {string}
     */
    Name: string;
    /**
     * Description of the genre.
     *
     * @type {string}
     */
    Description: string;
  };

  /**
   * Director of the movie, including name, bio, and optional birth date.
   *
   * @type {{ Name: string; Bio: string; Birth?: string }}
   */
  Director: {
    /**
     * Name of the director.
     *
     * @type {string}
     */
    Name: string;
    /**
     * Biography of the director.
     *
     * @type {string}
     */
    Bio: string;
    /**
     * Birth date of the director (optional).
     *
     * @type {string}
     */
    Birth?: string;
  };

  /**
   * Array of actor names in the movie.
   *
   * @type {string[]}
   */
  Actors: string[];

  /**
   * Path to the movie's image.
   *
   * @type {string}
   */
  ImagePath: string;

  /**
   * Indicates if the movie is featured.
   *
   * @type {boolean}
   */
  Featured: boolean;

  /**
   * Release year of the movie.
   *
   * @type {string}
   */
  Year: string;

  /**
   * Path to the movie's trailer.
   *
   * @type {string}
   */
  TrailerPath: string;

  /**
   * Rating of the movie.
   *
   * @type {string}
   */
  Rating: string;

  /**
   * Runtime of the movie.
   *
   * @type {string}
   */
  Runtime: string;

  /**
   * Indicates if the movie is marked as a favorite (optional).
   *
   * @type {boolean}
   */
  isFavorite?: boolean;

  /**
   * Indicates if the heart icon is active (optional).
   *
   * @type {boolean}
   */
  heartActive?: boolean;
}
