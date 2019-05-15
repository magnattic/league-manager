import { createFeatureSelector, createReducer, createSelector, on } from '@ngrx/store';
import { AuthActions } from '../actions/auth.actions';
import { Player } from '../players/player';

export interface AuthState {
  user: Player;
}

export const initialState: AuthState = {
  user: null
};

export const authReducer = createReducer<AuthState>(
  [on(AuthActions.userSessionRestored, (state, action) => ({ ...state, user: action.user }))],
  initialState
);

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(
  getAuthState,
  state => state.user
);
