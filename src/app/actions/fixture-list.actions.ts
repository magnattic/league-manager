import { createAction, props } from '@ngrx/store';
import { Fixture } from '../fixtures/fixture';

export const fixtureResultEntered = createAction('[Fixture List] Fixture result entered', props<{ fixture: Fixture }>());
