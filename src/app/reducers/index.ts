import { ActionReducer, ActionReducerMap, createFeatureSelector, createSelector, MetaReducer, Action } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { Fixture } from '../fixtures/fixture';
import { LeagueOverviewState, leagueOverviewReducer } from './league-overview.reducer';
import { InjectionToken } from '@angular/core';

export interface State {
  leagueOverview: LeagueOverviewState;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('Root reducers token', {
  factory: () => ({
    leagueOverview: leagueOverviewReducer
  })
});

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
