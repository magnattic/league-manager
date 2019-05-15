import { createAction, props, union } from '@ngrx/store';
import { Player } from '../players/player';

export const AuthActions = {
  emailSignInSuccess: createAction('[URL] Email sign in', props<{ email: string; emailLink: string }>()),
  signInMailRequested: createAction('[Login] Email link requested', props<{ email: string }>()),
  signInMailSent: createAction('[Auth API] SignIn Mail sent', props<{ email: string }>()),
  signInMailSendFailed: createAction('[Auth API] SignIn Mail send failed', props<{ error: Error }>()),
  userSessionRestored: createAction('[Auth API] User session restored', props<{ user: Player }>()),
  userLoginSuccess: createAction('[Auth API] User login successful', props<{ user: Player }>()),
  userLoginFailed: createAction('[Auth API] User login failed', props<{ error: Error }>())
};

const all = union(AuthActions);
export type ChangeUrlActions = typeof all;
