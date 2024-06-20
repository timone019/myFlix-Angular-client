// src/app/toolbar/toolbar.component.ts

import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * ToolbarComponent is responsible for managing the application's toolbar, including responsive design and user authentication actions.
 *
 * @export
 * @class ToolbarComponent
 */
@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  /**
   * Observable that emits a boolean indicating whether the viewport matches a handset display size.
   *
   * @type {Observable<boolean>}
   */
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  /**
   * Creates an instance of ToolbarComponent.
   *
   * @constructor
   * @param {BreakpointObserver} breakpointObserver - Service to observe breakpoints.
   * @param {Router} router - Service for navigating within the application.
   */
  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {} 

  /**
   * Logs out the current user by removing their data from localStorage and navigating to the welcome page.
   */
  logout(): void {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.router.navigate(['welcome']);
  }

  /**
   * Checks if a user is currently logged in by verifying the presence of a token in localStorage.
   *
   * @returns {boolean} - Returns true if a user is logged in, otherwise false.
   */
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
}
