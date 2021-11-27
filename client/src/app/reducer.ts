import { Reducer } from 'react';
import { Action, ActionType } from './actions';
import { StremioMeta, StremioStream } from './stremio/types';

export interface AppState {
  searchResults?: StremioMeta[]
  availableStreams?: StremioStream[]
}

export const appReducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.SearchResultsLoaded: return { ...state, searchResults: action.results };
    case ActionType.StreamsLoaded: return { ...state, availableStreams: action.streams };
    default: return state;
  }
};