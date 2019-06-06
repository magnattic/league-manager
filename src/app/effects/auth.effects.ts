import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigationAction, ROUTER_NAVIGATION } from '@ngrx/router-store';
import { from, of, combineLatest } from 'rxjs';
import { catchError, exhaustMap, filter, first, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { RouterStateUrl } from '../reducers/custom-route-serializer';
import { Store } from '@ngrx/store';
import { getPlayers } from '../reducers/league-overview.reducer';
import { State } from '../reducers';
import {
  userSessionRestored,
  userLoginSuccess,
  userLoginFailed,
  signInMailRequested,
  signInMailSent,
  signInMailSendFailed
} from '../actions/auth.actions';

@Injectable()
export class AuthEffects {
  constructor(private actions$: Actions, private readonly store: Store<State>, private readonly firebase: AngularFireAuth) {}

  existingAuth = createEffect(() =>
    combineLatest([
      this.firebase.user.pipe(first(user => user != null)),
      this.store.select(getPlayers).pipe(filter(players => players != null && players.length > 0))
    ]).pipe(
      map(([user, players]) => userSessionRestored({ user: players.find(player => player.id === user.email.replace('@enyway.com', '')) }))
    )
  );

  signInWithEmailLink = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      first(),
      filter((action: RouterNavigationAction<RouterStateUrl>) => this.firebase.auth.isSignInWithEmailLink(action.payload.routerState.url)),
      switchMap(action => {
        const email = window.localStorage.getItem('emailForSignIn') || window.prompt('Please provide your email for confirmation');
        return from(this.firebase.auth.signInWithEmailLink(email, action.payload.routerState.url));
      }),
      tap(() => window.localStorage.removeItem('emailForSignIn')),
      withLatestFrom(this.store.select(getPlayers).pipe(filter(players => players != null))),
      map(([result, players]) =>
        userLoginSuccess({ user: players.find(player => player.id === result.user.email.replace('@enyway.com', '')) })
      ),
      catchError(error => of(userLoginFailed({ error })))
    )
  );

  sendSignInMail = createEffect(() =>
    this.actions$.pipe(
      ofType(signInMailRequested),
      exhaustMap(action => {
        window.localStorage.setItem('emailForSignIn', action.email);
        return from(
          this.firebase.auth
            .sendSignInLinkToEmail(action.email, { url: window.location.href, handleCodeInApp: true })
            .then(() => action.email)
        );
      }),
      tap(() => window.alert('Mail sent! Check your inbox and click on the link to log in.')),
      map(email => signInMailSent({ email })),
      catchError(error => of(signInMailSendFailed({ error })))
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
