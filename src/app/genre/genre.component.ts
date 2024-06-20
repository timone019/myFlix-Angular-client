// src/app/genre/genre.component.ts

import { Component, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * GenreComponent is responsible for displaying information about a specific movie genre in a modal.
 *
 * @export
 * @class GenreComponent
 */
@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent {
  /**
   * Holds the genre data passed into the component.
   *
   * @type {*}
   */
  genre: any;

  /**
   * Creates an instance of GenreComponent.
   *
   * @constructor
   * @param {MatDialogRef<GenreComponent>} dialogRef - Reference to the dialog opened.
   * @param {FetchApiDataService} fetchApiData - Service to fetch data from the API.
   * @param {*} data - Data injected into the dialog, including genre information.
   */
  constructor(
    public dialogRef: MatDialogRef<GenreComponent>,
    public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.genre = data.genre;
  }

  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
