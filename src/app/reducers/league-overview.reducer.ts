import { createReducer, on } from '@ngrx/store';
import { fixturesLoaded } from '../actions/api.actions';
import { Fixture } from '../fixtures/fixture';

export interface LeagueOverviewState {
  fixtures: Fixture[];
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
  ]
};

export const leagueOverviewReducer = createReducer<LeagueOverviewState>(
  [on(fixturesLoaded, (state: LeagueOverviewState, { fixtures }) => ({ ...state, fixtures }))],
  initialState
);
