import { createReducer, createSelector, on } from '@ngrx/store';
import { orderBy } from 'lodash/fp';
import { fixturesLoaded, playersLoaded } from '../actions/api.actions';
import { sortOptionsChanged, playerSelected } from '../actions/table.actions';
import { Fixture, hasPlayer, isComplete, isSameMatch } from '../fixtures/fixture';
import { Player } from '../players/player';
import { getTableWithMovement, SortOptions } from '../table/table-calculation';
import * as fromRoot from './index';
import { generateFixtures } from 'src/app/fixtures/fixture-generator';

export interface LeagueOverviewState {
  playedFixtures: Fixture[];
  players: Player[];
  selectedPlayerName: string;
  sortOptions: SortOptions;
}

const initialState: LeagueOverviewState = {
  playedFixtures: [],
  players: [],
  selectedPlayerName: null,
  sortOptions: { criteria: 'points', ascending: false }
};

export const leagueOverviewReducer = createReducer<LeagueOverviewState>(
  [
    on(fixturesLoaded, (state: LeagueOverviewState, { fixtures }) => ({ ...state, fixtures })),
    on(playersLoaded, (state: LeagueOverviewState, { players }) => ({ ...state, players })),
    on(sortOptionsChanged, (state: LeagueOverviewState, { sortOptions }) => ({ ...state, sortOptions })),
    on(playerSelected, (state: LeagueOverviewState, { playerName }) => ({ ...state, selectedPlayerName: playerName }))
  ],
  initialState
);

export const getLeagueState = (state: fromRoot.State) => state.leagueOverview;

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
  getPlayers,
  (state, players) => players.find(player => player.name === state.selectedPlayerName)
);

const getPlayedFixtures = createSelector(
  getLeagueState,
  state => state.playedFixtures
);

const getGeneratedFixtures = createSelector(
  getPlayers,
  players => generateFixtures(players, false)
);

const getFixtures = createSelector(
  getGeneratedFixtures,
  getPlayedFixtures,
  getSelectedPlayer,
  (generatedFixtures, playedFixtures) =>
    generatedFixtures.map(genFix => playedFixtures.find(played => isSameMatch(played, genFix)) || genFix)
);

const getFilteredFixtures = createSelector(
  getFixtures,
  getSelectedPlayer,
  (fixtures, selectedPlayer) => fixtures.filter(fix => hasPlayer(fix, selectedPlayer))
);

export const getUpcomingFixtures = createSelector(
  getFilteredFixtures,
  fixtures => fixtures.filter(fix => !isComplete(fix))
);

const orderByDateEntered = orderBy([(fix: Fixture) => fix.dateEntered || new Date(2020)], ['desc']);

export const getLatestFixtures = createSelector(
  getFilteredFixtures,
  fixtures => orderByDateEntered(fixtures.filter(fix => isComplete(fix)))
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
