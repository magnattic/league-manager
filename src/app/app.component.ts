import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as fromRoot from './reducers';
import * as fromAuth from './reducers/auth.reducer';
import * as fromLeague from './reducers/league-overview.reducer';
import { UserInfo } from 'firebase';

@Component({
  selector: 'lm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'African Championships';
  public readonly playersNames$: Observable<string[]>;
  public readonly user$: Observable<UserInfo>;

  constructor(store: Store<fromRoot.State>, public firebase: AngularFireAuth) {
    this.playersNames$ = store.select(fromLeague.getPlayerNames);
    this.user$ = store.select(fromAuth.getUser);

    if (this.firebase.auth.isSignInWithEmailLink(window.location.href)) {
      const email = window.localStorage.getItem('emailForSignIn') || window.prompt('Please provide your email for confirmation');

      // The client SDK will parse the code from the link for you.
      this.firebase.auth
        .signInWithEmailLink(email, window.location.href)
        .then(result => {
          // Clear email from storage.
          window.localStorage.removeItem('emailForSignIn');
          // You can access the new user via result.user
          // Additional user info profile not available via:
          // result.additionalUserInfo.profile == null
          // You can check if the user is new or existing:
          // result.additionalUserInfo.isNewUser
        })
        .catch(error => {
          // Some error occurred, you can inspect the code: error.code
          // Common errors could be invalid email and invalid or expired OTPs.
        });
    }
  }

  login(email: string) {
    window.localStorage.setItem('emailForSignIn', email);
    this.firebase.auth.sendSignInLinkToEmail(email, { url: 'http://localhost:4200', handleCodeInApp: true }).then(console.log);
  }

  logout() {
    this.firebase.auth.signOut();
  }
}
