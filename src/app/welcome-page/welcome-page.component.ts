// src/app/welcome-page/welcome-page.component.ts

import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '../../environments/environment';


/**
 *
 *
 * @export
 * @class WelcomePageComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
    /**
   * Initializes the WelcomePageComponent.
   * @param {MatDialog} dialog - Angular Material's MatDialog service.
   */
  constructor(public dialog: MatDialog) {}

    /**
   * Angular lifecycle hook called after component initialization.
   */
  ngOnInit(): void {}

  // This is the function that will open the dialog when the signup button is clicked
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      // Assigning the dialog a width
      width: '280px',
    });
  }

  // This is the function that will open the dialog when the login button is clicked
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      // Assigning the dialog a width
      width: '280px',
    });
  }

  demoLogin(): void {
    // Step 1: Open the login dialog and get a reference to the dialog instance
    const dialogRef = this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  
    // Step 2: Wait for the dialog to be fully loaded
    dialogRef.afterOpened().subscribe(() => {
      // Assuming UserLoginFormComponent has methods `setCredentials` and `submitForm`
      // These methods do not exist by default and need to be implemented in your UserLoginFormComponent
      const instance = dialogRef.componentInstance;
      instance.setCredentials(environment.demoUser, environment.demoPassword); // Replace 'demoUser' and 'demoPass' with actual demo credentials
      instance.submitForm();
    });
  }
}
