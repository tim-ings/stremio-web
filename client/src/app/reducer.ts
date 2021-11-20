import { Reducer } from 'react';
import { Action, ActionType } from './actions';
import { SearchResult } from './search/types';

export interface AppState {
  searchResults: SearchResult[]
}

export const appReducer: Reducer<AppState, Action> = (state, action) => {
  switch (action.type) {
    case ActionType.SearchResultsLoaded: return { ...state, searchResults: action.results };
    default: return state;
  }
};