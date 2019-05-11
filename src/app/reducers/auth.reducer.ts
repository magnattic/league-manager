import { createFeatureSelector, createReducer, createSelector } from '@ngrx/store';

export interface AuthState {
  user: firebase.UserInfo;
}

export const initialState: AuthState = {
  user: null
};

export const authReducer = createReducer([], initialState);

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(
  getAuthState,
  state => state.user
);
