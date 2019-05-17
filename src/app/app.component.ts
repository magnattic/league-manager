import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { signInMailRequested } from './actions/auth.actions';
import { Player } from './players/player';
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
  public readonly players$: Observable<Player[]>;
  public readonly loggedInPlayer$: Observable<Player>;

  constructor(private store: Store<fromRoot.State>, public firebase: AngularFireAuth) {
    this.players$ = store.select(fromLeague.getPlayers);
    this.loggedInPlayer$ = store.select(fromAuth.getUser);
  }

  login(userId: string) {
    this.store.dispatch(signInMailRequested({ email: `${userId}@enyway.com` }));
  }

  logout() {
    this.firebase.auth.signOut();
  }
}
