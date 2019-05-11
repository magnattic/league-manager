import { createAction, props } from '@ngrx/store';
import { UserInfo } from 'firebase';

export const emailSignInSuccess = createAction('[URL] Email sign in', props<{ email: string; emailLink: string }>());
export const emailLinkRequested = createAction('[Login] Email link requested', props<{ email: string }>());
export const userLoginSuccess = createAction('[Auth API] User login successful', props<{ user: UserInfo }>());
export const userLoginFailed = createAction('[Auth API] User login failed', props<{ error: Error }>());
