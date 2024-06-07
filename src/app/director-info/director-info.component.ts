import { Component, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-director-info',
  templateUrl: './director-info.component.html',
  styleUrl: './director-info.component.scss',
})
export class DirectorInfoComponent {
  director: any;

  constructor(
    public dialogRef: MatDialogRef<DirectorInfoComponent>,
    public fetchApiData: FetchApiDataService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.director = data.director;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
