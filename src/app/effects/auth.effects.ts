import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { from, of } from 'rxjs';
import { filter, map, switchMap, tap, first, catchError } from 'rxjs/operators';
import { userLoginSuccess, userLoginFailed } from '../actions/auth.actions';
import { RouterStateUrl } from '../reducers/custom-route-serializer';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private firebase: AngularFireAuth) {}

  signInWithEmailLink = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      first(),
      filter((action: RouterNavigationAction<RouterStateUrl>) => this.firebase.auth.isSignInWithEmailLink(action.payload.routerState.url)),
      switchMap(action => {
        const email = window.localStorage.getItem('emailForSignIn') || window.prompt('Please provide your email for confirmation');
        return from(this.firebase.auth.signInWithEmailLink(email, action.payload.routerState.url)).pipe();
      }),
      tap(() => window.localStorage.removeItem('emailForSignIn')),
      map(result => userLoginSuccess({ user: result.user })),
      catchError(error => of(userLoginFailed({ error })))
    )
  );

  // if (this.firebase.auth.isSignInWithEmailLink(window.location.href)) {

  //   // The client SDK will parse the code from the link for you.
  //   this.firebase.auth
  //     .signInWithEmailLink(email, window.location.href)
  //     .then(result => {
  //       // Clear email from storage.
  //       window.localStorage.removeItem('emailForSignIn');
  //       // You can access the new user via result.user
  //       // Additional user info profile not available via:
  //       // result.additionalUserInfo.profile == null
  //       // You can check if the user is new or existing:
  //       // result.additionalUserInfo.isNewUser
  //     })
  //     .catch(error => {
  //       // Some error occurred, you can inspect the code: error.code
  //       // Common errors could be invalid email and invalid or expired OTPs.
  //     });
  // });
}
