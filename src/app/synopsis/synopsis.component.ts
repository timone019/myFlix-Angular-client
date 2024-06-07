import { Component, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-synopsis',
  templateUrl: './synopsis.component.html',
  styleUrls: ['./synopsis.component.scss']
})
export class SynopsisComponent {
  movie: any;

    /**
   * Initializes the SynopsisComponent.
   * @param {MatDialogRef<SynopsisComponent>} dialogRef - Reference to the dialog.
   * @param {any} data - Data injected into the dialog.
   */

  constructor(
    public dialogRef: MatDialogRef<SynopsisComponent>,
    // public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { 
    this.movie = data.movie;
  }

  // ngOnInit(): void {
  //   this.getMovieDetails(this.data.movie.Title);
  // }

//   getMovieDetails(title: string): void {
//   this.fetchApiData.getOneMovie(title).subscribe((resp: any) => {
//     this.movie = resp;
//     console.log('Movie Details:', this.movie);
//   }, (error) => {
//     console.error('Error fetching movie details:', error);
//   });
// }

  closeDialog(): void {
    this.dialogRef.close();
  }
}