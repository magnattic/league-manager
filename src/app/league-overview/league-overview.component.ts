import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as _ from 'lodash';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, withLatestFrom, tap } from 'rxjs/operators';
import { Fixture, isComplete } from '../fixtures/fixture';
import { TableEntry } from '../table/table-entry';
import { State } from '../reducers';
import * as fromLeague from '../reducers/league-overview.reducer';
import { sortOptionsChanged } from '../actions/table.actions';
import { SortOptions } from '../table/table-calculation';

@Component({
  selector: 'lm-league-overview',
  templateUrl: './league-overview.component.html',
  styleUrls: ['./league-overview.component.css']
})
export class LeagueOverviewComponent implements OnInit {
  searchTerm = '';

  public readonly fixtures$: Observable<Fixture[]>;
  public readonly table$: Observable<TableEntry[]>;
  public upcomingfixtures$: Observable<Fixture[]>;
  public latestFixtures$: Observable<Fixture[]>;
  public searchTerm$ = new BehaviorSubject<string>(null);

  constructor(private store: Store<State>) {
    this.fixtures$ = this.store.select(fromLeague.getFixtures);
    this.table$ = this.store.select(fromLeague.getTable);
  }

  ngOnInit(): void {
    this.searchTerm$.next(null);
    this.upcomingfixtures$ = this.getUpcomingFixtures();
    this.latestFixtures$ = this.getLatestFixtures();
  }

  private getFixtures() {
    return this.fixtures$.pipe(
      withLatestFrom(this.searchTerm$),
      map(([fixtures, searchTerm]) => {
        if (searchTerm === null) {
          return fixtures;
        } else {
          return fixtures.filter(fix => fix.teamA === searchTerm || fix.teamB === searchTerm);
        }
      }),
      map(fixtures => _.orderBy(fixtures, [fix => fix.dateEntered || new Date(2020)], ['desc']))
    );
  }

  private getUpcomingFixtures() {
    return this.getFixtures().pipe(map(fixtures => fixtures.filter(fix => !isComplete(fix))));
  }

  private getLatestFixtures() {
    return this.getFixtures().pipe(map(fixtures => fixtures.filter(fix => isComplete(fix))));
  }

  public sortTable(sortOptions: SortOptions) {
    this.store.dispatch(sortOptionsChanged({ sortOptions }));
  }

  public onFixtureChange(fixture: Fixture) {
    // this.fixtureService.updateResult(fixture);
  }
}
