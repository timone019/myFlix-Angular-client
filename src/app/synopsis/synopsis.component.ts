// src/app/synopsis/synopsis.component.ts

import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * SynopsisComponent is responsible for displaying the synopsis of a movie in a modal dialog.
 *
 * @export
 * @class SynopsisComponent
 */
@Component({
  selector: 'app-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrls: ['./synopsis.component.scss']
})
export class SynopsisComponent {
  /**
   * Holds the movie data passed into the component.
   *
   * @type {*}
   */
  movie: any;

  /**
   * Creates an instance of SynopsisComponent.
   *
   * @constructor
   * @param {MatDialogRef<SynopsisComponent>} dialogRef - Reference to the dialog.
   * @param {*} data - Data injected into the dialog, including movie information.
   */
  constructor(
    public dialogRef: MatDialogRef<SynopsisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.movie = data.movie;
  }

  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
