import { createReducer, createSelector, on } from '@ngrx/store';
import { orderBy } from 'lodash/fp';
import { fixturesLoaded, playersLoaded } from '../actions/api.actions';
import { sortOptionsChanged, playerSelected } from '../actions/table.actions';
import { Fixture, hasPlayer, isComplete } from '../fixtures/fixture';
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
  playedFixtures: [
    {
      teamA: 'Dominik',
      teamB: 'Linus',
      goalsA: 1,
      goalsB: 0,
      dateEntered: new Date(),
      matchNumber: 1
    }
  ],
  players: [{ id: 'dominik', name: 'Dominik' }, { id: 'linus', name: 'Linus' }],
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

export const getPlayedFixtures = createSelector(
  getLeagueState,
  getSelectedPlayer,
  (state, player) => {
    const filtered = player ? state.playedFixtures.filter(fix => hasPlayer(fix, player)) : state.playedFixtures;
    return orderBy([(fix: Fixture) => fix.dateEntered || new Date(2020)], ['desc'])(filtered);
  }
);

const getGeneratedFixtures = createSelector(
  getPlayers,
  players => generateFixtures(players)
);

const getFixtures = createSelector(
  getGeneratedFixtures,
  getSelectedPlayer,
  (fixtures, selectedPlayer) => {
    console.log(fixtures, selectedPlayer);
    return fixtures.filter(fix => hasPlayer(fix, selectedPlayer));
  }
);

export const getUpcomingFixtures = createSelector(
  getFixtures,
  fixtures => fixtures.filter(fix => !isComplete(fix))
);

export const getLatestFixtures = createSelector(
  getPlayedFixtures,
  fixtures => fixtures.filter(fix => isComplete(fix))
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
