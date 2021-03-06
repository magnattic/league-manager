import { createAction, props } from '@ngrx/store';
import { SortOptions } from '../table/table-calculation';

export const sortOptionsChanged = createAction('[Table] Sort Options changed', props<{ sortOptions: SortOptions }>());
export const playerSelected = createAction('[Table] Player selected', props<{ playerName: string }>());
