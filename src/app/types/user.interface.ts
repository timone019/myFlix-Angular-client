// src/app/types/user.interface.ts

/**
 * Interface representing a user in the application.
 *
 * @export
 * @interface User
 */
export interface User {
  /**
   * Unique identifier for the user.
   *
   * @type {string}
   */
  _id: string;

  /**
   * Full name of the user.
   *
   * @type {string}
   */
  FullName: string;

  /**
   * Username of the user.
   *
   * @type {string}
   */
  Username: string;

  /**
   * Password of the user.
   *
   * @type {string}
   */
  Password: string;

  /**
   * Email address of the user.
   *
   * @type {string}
   */
  Email: string;

  /**
   * Birthday of the user.
   *
   * @type {Date}
   */
  Birthday: Date;

  /**
   * Array of favorite movie IDs for the user.
   *
   * @type {string[]}
   */
  FavoriteMovies: string[];
}
