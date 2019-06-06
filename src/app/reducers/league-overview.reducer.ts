import { createReducer, createSelector, on } from '@ngrx/store';
import { orderBy } from 'lodash/fp';
import { AbstractControlState, createFormArrayState, FormArrayState, setUserDefinedProperty, setValue } from 'ngrx-forms';
import { generateFixtures } from 'src/app/fixtures/fixture-generator';
import { fixturesLoaded, playersLoaded } from '../actions/api.actions';
import { playerSelected, sortOptionsChanged } from '../actions/table.actions';
import { Fixture, hasPlayer, isComplete, isSameMatch } from '../fixtures/fixture';
import { Player } from '../players/player';
import { getTableWithMovement, SortOptions } from '../table/table-calculation';
import * as fromRoot from './index';

export interface LeagueOverviewState {
  playedFixtures: Fixture[];
  players: Player[];
  selectedPlayerName: string;
  sortOptions: SortOptions;
  upcomingFixturesForm: FormArrayState<Fixture>;
  latestFixturesForm: FormArrayState<Fixture>;
}

const setReadonly = <T>(state: AbstractControlState<T>) => setUserDefinedProperty(state, 'readonly', true);

const initialState: LeagueOverviewState = {
  playedFixtures: [],
  players: [],
  selectedPlayerName: null,
  sortOptions: { criteria: 'points', ascending: false },
  upcomingFixturesForm: createFormArrayState<Fixture>('upcomingFixtures', []),
  latestFixturesForm: createFormArrayState<Fixture>('latestFixtures', [])
};

export const leagueOverviewReducer = createReducer(
  initialState,
  on(fixturesLoaded, (state, { fixtures }) => ({
    ...state,
    playedFixtures: fixtures,
    latestFixturesForm: setReadonly(setValue(state.latestFixturesForm, fixtures))
  })),
  on(playersLoaded, (state, { players }) => ({ ...state, players })),
  on(sortOptionsChanged, (state, { sortOptions }) => ({ ...state, sortOptions })),
  on(playerSelected, (state, { playerName }) => ({
    ...state,
    selectedPlayerName: state.selectedPlayerName === playerName ? null : playerName
  }))
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
  (generatedFixtures, playedFixtures) => {
    return generatedFixtures.map(genFix => playedFixtures.find(played => isSameMatch(played, genFix)) || genFix);
  }
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

const orderByDateEntered = orderBy([(fix: Fixture) => new Date(fix.dateEntered || 2020)], ['desc']);

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

export const getLatestFixturesForm = createSelector(
  getLatestFixtures,
  latestFixtures => createFormArrayState<Fixture>('latestFixtures', latestFixtures)
);

export const getUpcomingFixturesForm = createSelector(
  getUpcomingFixtures,
  upcomingFixtures => createFormArrayState<Fixture>('upcomingFixtures', upcomingFixtures)
);
