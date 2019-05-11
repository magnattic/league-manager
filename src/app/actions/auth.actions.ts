import { createAction, props } from '@ngrx/store';

createAction('[URL] Email sign in', () => props<{ email: string; emailLink: string }>());
createAction('[Login] Email link requested', () => props<{ email: string }>());
createAction('[Auth API] User login successful', () => props<{ email: string }>());
createAction('[Auth API] User login failed', () => props<{ error: Error }>());
