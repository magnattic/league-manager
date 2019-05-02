import * as _ from 'lodash';
import { Fixture, isComplete } from '../fixtures/fixture';
import { TableEntry } from './table-entry';

const sortOptions: SortOptions = { criteria: 'points', ascending: false };

const sortTable = (table: TableEntry[], sortOptions: SortOptions) => {
  const order = sortOptions.ascending ? 'asc' : 'desc';
  const altOrder = order === 'asc' ? 'desc' : 'asc';
  return _.orderBy(table, [sortOptions.criteria, 'goalDifference', 'goalsScored', 'playerName'], [order, order, order, altOrder]);
};

export const getTableWithMovement = (fixtures: Fixture[], sortOptions: SortOptions) => {
  const table = calculateTable(fixtures);
  const tableSorted = sortTable(table, sortOptions);
  const tableYesterday = getTableYesterday(fixtures, sortOptions);
  const tableWithMovement = setMovement(tableSorted, tableYesterday);
  return tableWithMovement;
};

export const getTableYesterday = (fixtures: Fixture[], sortOptions: SortOptions) => {
  const fixturesYesterday = fixtures.map(fixtures => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return _.filter(fixtures, fix => fix.dateEntered == null || new Date(fix.dateEntered) <= yesterday);
  });
  const tableUnsorted = calculateTable(fixturesYesterday);

  return sortTable(tableUnsorted, sortOptions);
};

export const calculateTable = (fixtures: Fixture[]) => {
  const table = new Map<string, TableEntry>();
  for (const fixture of fixtures) {
    ensurePlayerInTable(table, fixture.teamA);
    ensurePlayerInTable(table, fixture.teamB);
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
    table.set(fixture.teamA, {
      playerName: oldEntryA.playerName,
      wins: result > 0 ? oldEntryA.wins + 1 : oldEntryA.wins,
      draws: result === 0 ? oldEntryA.draws + 1 : oldEntryA.draws,
      losses: result < 0 ? oldEntryA.losses + 1 : oldEntryA.losses,
      goalsScored: +oldEntryA.goalsScored + +fixture.goalsA,
      goalsConceded: +oldEntryA.goalsConceded + +fixture.goalsB
    });

    const oldEntryB = table.get(fixture.teamB);
    table.set(fixture.teamB, {
      playerName: oldEntryB.playerName,
      wins: result < 0 ? oldEntryB.wins + 1 : oldEntryB.wins,
      draws: result === 0 ? oldEntryB.draws + 1 : oldEntryB.draws,
      losses: result > 0 ? oldEntryB.losses + 1 : oldEntryB.losses,
      goalsScored: +oldEntryB.goalsScored + +fixture.goalsB,
      goalsConceded: +oldEntryB.goalsConceded + +fixture.goalsA
    });
  }
  return Array.from(table.values());
};

const ensurePlayerInTable = (entries: Map<string, TableEntry>, player: string) => {
  if (!entries.has(player)) {
    entries.set(player, { playerName: player, wins: 0, draws: 0, losses: 0, goalsScored: 0, goalsConceded: 0 });
  }
};

const setMovement = (tableToday: TableEntry[], tableYesterday: TableEntry[]) => {
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
};

export const sortBy = (table: TableEntry[], criteria: string, ascending: boolean) => {
  const sortOptions = { criteria, ascending };
  return sortTable(table, sortOptions);
};

export interface SortOptions {
  criteria: string;
  ascending: boolean;
}
