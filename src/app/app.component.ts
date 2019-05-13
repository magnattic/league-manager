import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { UserInfo } from 'firebase';
import { Observable } from 'rxjs';
import * as fromRoot from './reducers';
import * as fromAuth from './reducers/auth.reducer';
import * as fromLeague from './reducers/league-overview.reducer';

@Component({
  selector: 'lm-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'African Championships - Season 2';
  public readonly playersNames$: Observable<string[]>;
  public readonly user$: Observable<UserInfo>;

  constructor(store: Store<fromRoot.State>, public firebase: AngularFireAuth) {
    this.playersNames$ = store.select(fromLeague.getPlayerNames);
    this.user$ = store.select(fromAuth.getUser);
  }

  login(email: string) {
    window.localStorage.setItem('emailForSignIn', email);
    this.firebase.auth.sendSignInLinkToEmail(email, { url: 'http://localhost:4200', handleCodeInApp: true }).then(console.log);
  }

  logout() {
    this.firebase.auth.signOut();
  }
}
