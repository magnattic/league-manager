import { InjectionToken } from '@angular/core';
import { Action, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { authReducer, AuthState } from './auth.reducer';
import { leagueOverviewReducer, LeagueOverviewState } from './league-overview.reducer';

export interface State {
  leagueOverview: LeagueOverviewState;
  auth: AuthState;
}

export const ROOT_REDUCERS = new InjectionToken<ActionReducerMap<State, Action>>('Root reducers token', {
  factory: () => ({
    leagueOverview: leagueOverviewReducer,
    auth: authReducer
  })
});

export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
