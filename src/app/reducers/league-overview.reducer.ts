import { createReducer, createSelector, on, createFeatureSelector } from '@ngrx/store';
import { fixturesLoaded, playersLoaded } from '../actions/api.actions';
import { Fixture } from '../fixtures/fixture';
import { Player } from '../players/player';
import * as fromRoot from './index';
import { calculateTable, SortOptions, getTableWithMovement } from '../table/table-calculation';
import { sortOptionsChanged } from '../actions/table.actions';

export interface LeagueOverviewState {
  fixtures: Fixture[];
  players: Player[];
  selectedPlayer: string;
  sortOptions: SortOptions;
}

const initialState: LeagueOverviewState = {
  fixtures: [
    {
      teamA: 'Dominik',
      teamB: 'Linus',
      goalsA: 1,
      goalsB: 0,
      dateEntered: new Date(),
      matchNumber: 1
    }
  ],
  players: [{ name: 'Dominik' }, { name: 'Linus' }],
  selectedPlayer: null,
  sortOptions: { criteria: 'points', ascending: false }
};

export const leagueOverviewReducer = createReducer<LeagueOverviewState>(
  [
    on(fixturesLoaded, (state: LeagueOverviewState, { fixtures }) => ({ ...state, fixtures })),
    on(playersLoaded, (state: LeagueOverviewState, { players }) => ({ ...state, players })),
    on(sortOptionsChanged, (state: LeagueOverviewState, { sortOptions }) => ({ ...state, sortOptions }))
  ],
  initialState
);

export const getLeagueState = (state: fromRoot.State) => state.leagueOverview;

export const getFixtures = createSelector(
  getLeagueState,
  state => state.fixtures
);

export const getSortOptions = createSelector(
  getLeagueState,
  state => state.sortOptions
);

export const getTable = createSelector(
  getFixtures,
  getSortOptions,
  (fixtures, sortOptions) => getTableWithMovement(fixtures, sortOptions)
);

export const getPlayers = createSelector(
  getLeagueState,
  state => state.players
);
export const getPlayerNames = createSelector(
  getPlayers,
  players => players.map(player => player.name)
);

export const getSelectedPlayer = createSelector(
  getLeagueState,
  state => state.selectedPlayer
);
