import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Fixture } from '../fixtures/fixture';
import { LeagueOverviewState, leagueOverviewReducer } from './league-overview.reducer';

export interface State {
  leagueOverview: LeagueOverviewState;
}

export const reducers: ActionReducerMap<State> = {
  leagueOverview: leagueOverviewReducer
};

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
