import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ROUTER_NAVIGATION } from '@ngrx/router-store';
import { from, of, pipe, throwError } from 'rxjs';
import { catchError, first, map, mapTo, switchMap, filter, tap } from 'rxjs/operators';
import { fixtureResultAdded, fixturesLoaded, fixturesLoadFailed, playersLoaded, playersLoadFailed } from '../actions/api.actions';
import { fixtureResultEntered } from '../actions/fixture-list.actions';
import { Fixture, isComplete } from '../fixtures/fixture';
import { Player } from '../players/player';

const throwIfEmpty = <T>(error: string) =>
  pipe(
    switchMap((array: T[]) => {
      if (array && array.length > 0) {
        return of(array);
      } else {
        return throwError(error);
      }
    })
  );

@Injectable()
export class FixtureEffects {
  constructor(private actions$: Actions, private firestore: AngularFirestore) {}

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
            throwIfEmpty("Couldn't load fixtures"),
            map(fixtures => fixturesLoaded({ fixtures })),
            catchError(error => of(fixturesLoadFailed({ error })))
          )
      )
    )
  );

  playersChanged = createEffect(() =>
    this.firestore
      .collection<{ name: string }>('players')
      .snapshotChanges()
      .pipe(
        map(actions => actions.map(a => ({ id: a.payload.doc.id, ...a.payload.doc.data() } as Player))),
        throwIfEmpty("Couldn't load players"),
        map(players => playersLoaded({ players })),
        catchError(error => of(playersLoadFailed({ error })))
      )
  );

  setFixtureResult = createEffect(() =>
    this.actions$.pipe(
      ofType(fixtureResultEntered),
      map(action => action.fixture),
      tap(console.log),
      filter(fix => isComplete(fix)),
      switchMap(fix => from(this.firestore.collection<Fixture>('fixtures').add(fix)).pipe(mapTo(fixtureResultAdded({ fixture: fix }))))
    )
  );
}
