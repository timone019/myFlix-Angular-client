import { Component, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent {
  genre: any;

  constructor(
    public dialogRef: MatDialogRef<GenreComponent>,
    public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.genre = data.genre;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
