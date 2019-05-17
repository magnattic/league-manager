import { createAction, props } from '@ngrx/store';
import { Player } from '../players/player';

export const emailSignInSuccess = createAction('[URL] Email sign in', props<{ email: string; emailLink: string }>());
export const signInMailRequested = createAction('[Login] Email link requested', props<{ email: string }>());
export const signInMailSent = createAction('[Auth API] SignIn Mail sent', props<{ email: string }>());
export const signInMailSendFailed = createAction('[Auth API] SignIn Mail send failed', props<{ error: Error }>());
export const userSessionRestored = createAction('[Auth API] User session restored', props<{ user: Player }>());
export const userLoginSuccess = createAction('[Auth API] User login successful', props<{ user: Player }>());
export const userLoginFailed = createAction('[Auth API] User login failed', props<{ error: Error }>());
