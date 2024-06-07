import { Component, OnInit, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-genre',
  templateUrl: './genre.component.html',
  styleUrl: './genre.component.scss'
})
export class GenreComponent implements OnInit {
  genre: any;

  constructor(
    public dialogRef: MatDialogRef<GenreComponent>,
    public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.genre = data.genre;
  }

  ngOnInit(): void {
    this.getGenre(this.data.genre);
  }

  getGenre(genre: any): void {
    this.fetchApiData.getGenre(genre).subscribe((resp: any) => {
      this.genre = resp;
      console.log('Genre Details:', this.genre);
    }, (error) => {
      console.error('Error fetching genre details:', error);
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

}
