import { createReducer, on } from '@ngrx/store';
import { incrementVersion } from './child2.actions';

export const child2FeatureKey = 'child2';

export interface Child2State {
  name: string;
  version: number;
}

export const initialState: Child2State = {
  name: child2FeatureKey,
  version: 0
};

export const child2Reducer = createReducer(
  initialState,
  on(incrementVersion, (state) => ({
    ...state,
    version: state.version + 1
  }))
);
