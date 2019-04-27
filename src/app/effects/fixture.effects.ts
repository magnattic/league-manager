import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { first, map, switchMap } from 'rxjs/operators';
import { fixturesLoaded } from '../actions/api.actions';
import { Fixture } from '../fixtures/fixture';

@Injectable()
export class FixtureEffects {
  loadFixtures$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      first(),
      switchMap(() =>
        this.firestore
          .collection<Fixture>('fixtures')
          .valueChanges()
          .pipe(
            first(),
            map(fixtures => fixturesLoaded({ fixtures: fixtures }))
          )
      )
    )
  );

  constructor(private actions$: Actions, private firestore: AngularFirestore) {}
}
