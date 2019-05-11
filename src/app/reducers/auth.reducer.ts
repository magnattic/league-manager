import { createFeatureSelector, createReducer, createSelector } from '@ngrx/store';

export interface AuthState {
  user: firebase.UserInfo;
}

export const initialState: AuthState = {
  user: {
    uid: 'dominik',
    displayName: 'Dominik',
    email: 'dominik@enyway.com',
    phoneNumber: null,
    photoURL: null,
    providerId: 'email'
  }
};

export const authReducer = createReducer([], initialState);

export const getAuthState = createFeatureSelector<AuthState>('auth');

export const getUser = createSelector(
  getAuthState,
  state => state.user
);
