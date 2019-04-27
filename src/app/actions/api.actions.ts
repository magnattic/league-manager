import { createAction, props } from '@ngrx/store';
import { Fixture } from '../fixtures/fixture';

export const fixturesLoaded = createAction('[Fixture Api] Fixtures loaded', props<{ fixtures: Fixture[] }>());
export const fituresLoadFailed = createAction('[Fixture Api] Fixtures load failed');
