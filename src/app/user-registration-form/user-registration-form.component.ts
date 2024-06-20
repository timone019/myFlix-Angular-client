// src/app/user-registration-form/user-registration-form.component.ts

import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-registration-form',
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss']
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * The default registration form data
   *
   * @type {{ FullName: string; Username: string; Password: string; Email: string; Birthday: string }}
   */
  @Input() userData = { FullName: '', Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Called when creating an instance of the class
   * @param {FetchApiDataService} fetchApiData - Service for API calls
   * @param {MatDialogRef<UserRegistrationFormComponent>} dialogRef - Reference to the dialog
   * @param {MatSnackBar} snackBar - Service for snack-bar notifications
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}

  /**
   * Sends the registration form inputs to the backend and handles the response.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe(
      (response) => {
        // Logic for a successful user registration goes here!
        this.dialogRef.close(); // This will close the modal on success!
        console.log(response);
        this.snackBar.open('User registration successful', 'OK', {
          duration: 2000
        });
      },
      (response) => {
        console.log(response);
        this.snackBar.open(response, 'OK', {
          duration: 2000
        });
      }
    );
  }
}
