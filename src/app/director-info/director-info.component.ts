import { Component, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

/**
 * Component for displaying information about a director.
 * 
 * @component
 * @example
 * <app-director-info></app-director-info>
 */
@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss',
})
export class DirectorInfoComponent {
  /**
   * The director information to be displayed.
   */
  director: any;

  /**
   * Creates an instance of DirectorInfoComponent.
   * 
   * @param dialogRef - Reference to the dialog opened containing this component.
   * @param fetchApiData - Service for fetching data from the API.
   * @param data - The data injected into the dialog.
   */
  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.director = data.director;
  }

  /**
   * Closes the dialog.
   */
  closeDialog(): void {
    this.dialogRef.close();
  }
}
