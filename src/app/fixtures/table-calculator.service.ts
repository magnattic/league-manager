import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Fixture, isComplete } from './fixture';
import { TableEntry } from './table-entry';

@Injectable({ providedIn: 'root' })
export class TableCalculatorService {
  private sortOptions$ = new BehaviorSubject<SortOptions>({ criteria: 'points', ascending: false });

  public getTable(fixtures$: Observable<Fixture[]>) {
    const tableSorted$ = combineLatest(
      fixtures$.pipe(
        tap(fixtures => console.log(`today: ${fixtures.length}`)),
        map(fixtures => this.calculateTable(fixtures))
      ),
      this.sortOptions$
    ).pipe(map(([tableUnsorted, sortOptions]) => this.sortTable(tableUnsorted, sortOptions)));
    return combineLatest(tableSorted$, this.getTableYesterday(fixtures$)).pipe(
      map(([today, yesterday]) => this.setMovement(today, yesterday))
    );
  }

  public getTableYesterday(fixtures$: Observable<Fixture[]>) {
    const tableUnsorted$ = fixtures$.pipe(
      map(fixtures => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        console.log(yesterday);
        return _.filter(fixtures, fix => fix.dateEntered == null || new Date(fix.dateEntered) <= yesterday);
      }),
      tap(fixtures => console.log(`yesterday: ${fixtures.length}`)),
      map(fixtures => this.calculateTable(fixtures))
    );
    return combineLatest(tableUnsorted$, this.sortOptions$).pipe(
      map(([tableUnsorted, sortOptions]) => this.sortTable(tableUnsorted, sortOptions))
    );
  }

  private calculateTable(fixtures: Fixture[]) {
    const table = new Map<string, TableEntry>();
    for (const fixture of fixtures) {
      this.ensureEntry(table, fixture.teamA);
      this.ensureEntry(table, fixture.teamB);
      if (!isComplete(fixture)) {
        continue;
      }
      let result: number;
      if (fixture.goalsA > fixture.goalsB) {
        result = 1;
      } else if (fixture.goalsA < fixture.goalsB) {
        result = -1;
      } else {
        result = 0;
      }
      const oldEntryA = table.get(fixture.teamA);
      table.set(
        fixture.teamA,
        new TableEntry(
          oldEntryA.playerName,
          result > 0 ? oldEntryA.wins + 1 : oldEntryA.wins,
          result === 0 ? oldEntryA.draws + 1 : oldEntryA.draws,
          result < 0 ? oldEntryA.losses + 1 : oldEntryA.losses,
          +oldEntryA.goalsScored + +fixture.goalsA,
          +oldEntryA.goalsConceded + +fixture.goalsB
        )
      );

      const oldEntryB = table.get(fixture.teamB);
      table.set(
        fixture.teamB,
        new TableEntry(
          oldEntryB.playerName,
          result < 0 ? oldEntryB.wins + 1 : oldEntryB.wins,
          result === 0 ? oldEntryB.draws + 1 : oldEntryB.draws,
          result > 0 ? oldEntryB.losses + 1 : oldEntryB.losses,
          +oldEntryB.goalsScored + +fixture.goalsB,
          +oldEntryB.goalsConceded + +fixture.goalsA
        )
      );
    }
    return Array.from(table.values());
  }

  private sortTable(table: TableEntry[], sortOptions: SortOptions) {
    const order = sortOptions.ascending ? 'asc' : 'desc';
    const altOrder = order === 'asc' ? 'desc' : 'asc';
    return _.orderBy(table, [sortOptions.criteria, 'goalDifference', 'goalsScored', 'playerName'], [order, order, order, altOrder]);
  }

  private ensureEntry(entries: Map<string, TableEntry>, player: string) {
    if (!entries.has(player)) {
      entries.set(player, new TableEntry(player, 0, 0, 0, 0, 0));
    }
  }

  private setMovement(tableToday: TableEntry[], tableYesterday: TableEntry[]) {
    tableToday.forEach((entry, index) => {
      const indexYesterday = tableYesterday.findIndex(x => x.playerName === entry.playerName);
      tableToday[index].movement = null;
      if (index < indexYesterday) {
        tableToday[index].movement = 'up';
      } else if (index > indexYesterday) {
        tableToday[index].movement = 'down';
      }
    });
    return tableToday;
  }

  public sortBy(criteria: string, ascending: boolean) {
    const sortOptions = { criteria, ascending };
    this.sortOptions$.next(sortOptions);
  }
}

export interface SortOptions {
  criteria: string;
  ascending: boolean;
}
