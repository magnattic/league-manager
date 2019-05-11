import { createAction, props } from '@ngrx/store';
import { Fixture } from '../fixtures/fixture';
import { Player } from '../players/player';

export const fixturesLoaded = createAction('[Fixture Api] Fixtures loaded', props<{ fixtures: Fixture[] }>());
export const fixturesLoadFailed = createAction('[Fixture Api] Fixtures load failed', props<{ error: Error }>());
export const fixtureResultAdded = createAction('[Fixture Api] Fixture added', props<{ fixture: Fixture }>());
export const playersLoaded = createAction('[Player Api] Players loaded', props<{ players: Player[] }>());
export const playersLoadFailed = createAction('[Player Api] Players load failed', props<{ error: Error }>());
