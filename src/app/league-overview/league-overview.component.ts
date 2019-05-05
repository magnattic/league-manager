import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom, tap } from 'rxjs/operators';
import { Fixture, isComplete } from '../fixtures/fixture';
import { TableEntry } from '../table/table-entry';
import { State } from '../reducers';
import * as fromLeague from '../reducers/league-overview.reducer';
import { sortOptionsChanged, playerSelected } from '../actions/table.actions';
import { SortOptions } from '../table/table-calculation';
import { Player } from '../players/player';

@Component({
  selector: 'lm-league-overview',
  templateUrl: './league-overview.component.html',
  styleUrls: ['./league-overview.component.css']
})
export class LeagueOverviewComponent {
  public readonly selectedPlayer$: Observable<Player>;
  public readonly fixtures$: Observable<Fixture[]>;
  public readonly table$: Observable<TableEntry[]>;
  public upcomingfixtures$: Observable<Fixture[]>;
  public latestFixtures$: Observable<Fixture[]>;

  constructor(private store: Store<State>) {
    this.selectedPlayer$ = this.store.select(fromLeague.getSelectedPlayer);
    this.fixtures$ = this.store.select(fromLeague.getPlayedFixtures);
    this.upcomingfixtures$ = this.store.select(fromLeague.getUpcomingFixtures);
    this.latestFixtures$ = this.store.select(fromLeague.getLatestFixtures);
    this.table$ = this.store.select(fromLeague.getTable);
  }

  public sortTable(sortOptions: SortOptions) {
    this.store.dispatch(sortOptionsChanged({ sortOptions }));
  }

  public selectedPlayerChanged(playerName: string) {
    this.store.dispatch(playerSelected({ playerName }));
  }

  public onFixtureChange(fixture: Fixture) {
    // this.fixtureService.updateResult(fixture);
  }
}
