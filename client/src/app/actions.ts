import { SearchResult } from './search/types';

export enum ActionType {
  SearchResultsLoaded = `SearchResultsLoaded`
}

export interface SearchResultsLoadedAction {
  type: ActionType
  results: SearchResult[]
}

export type Action
  = SearchResultsLoadedAction;
