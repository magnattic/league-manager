import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { Player } from '../players/player';
import { userSessionRestored } from '../actions/auth.actions';

export interface AuthState {
  user: Player;
}

export const initialState: AuthState = {
  user: null
};

export const authReducer = createReducer(initialState, on(userSessionRestored, (state, { user }) => ({ ...state, user })));

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(
  getAuthState,
  state => state.user
);
