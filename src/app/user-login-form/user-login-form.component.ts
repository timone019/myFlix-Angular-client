// src/app/user-login-form/user-login-form.component.ts

import { Component, OnInit, Input } from '@angular/core';

// You'll use this import to close the dialog on success
import { MatDialogRef } from '@angular/material/dialog';

// This import brings in the API calls we created in 6.2
import { FetchApiDataService } from '../fetch-api-data.service';

// This import is used to display notifications back to the user
import { MatSnackBar } from '@angular/material/snack-bar';

import { Router } from '@angular/router';

@Component({
  selector: 'app-user-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * The default login form data
   *
   * @type {{ Username: string; Password: string }}
   */
  @Input() userData = { Username: '', Password: '' }; // This is the default login form

  /**
   * Called when creating an instance of the class
   * @param {FetchApiDataService} fetchApiData - Service for API calls
   * @param {MatDialogRef<UserLoginFormComponent>} dialogRef - Reference to the dialog
   * @param {MatSnackBar} snackBar - Service for snack-bar notifications
   * @param {Router} router - Router for navigation
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Lifecycle hook that is called after data-bound properties of a directive are initialized.
   */
  ngOnInit(): void {}

  /**
   * Sends the login form inputs to the backend and handles the response.
   *
   * @param {Event} [event] - Optional event parameter to prevent default form submission
   */
  loginUser(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.fetchApiData.userLogin(this.userData).subscribe(
      (response) => {
        // Logic for a successful user login goes here!
        this.dialogRef.close(); // This will close the modal on success!
        console.log(response);
        console.log('response.user:', response.user);
        console.log('response.user.Username:', response.user.Username);
        if (response.user && response.user.Username) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('currentUser', JSON.stringify(response.user));
          this.snackBar.open('User login successful', 'OK', {
            duration: 2000
          });
          this.router.navigate(['movies']);
        } else {
          console.error('No user found in response');
        }      
      },
      (response) => {
        console.log(response);
        this.snackBar.open(response, 'OK', {
          duration: 2000
        });
      }
    );
  }

  // Method to programmatically set the credentials
  setCredentials(username: string, password: string): void {
    this.userData.Username = username;
    this.userData.Password = password;
  }

  // Method to programmatically submit the form
  submitForm(): void {
    this.loginUser();
  }

}
