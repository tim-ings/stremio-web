import { StremioMeta, StremioStream } from './stremio/types';

export enum ActionType {
  SearchResultsLoaded = `SearchResultsLoaded`,
  StreamsLoaded = `StreamsLoaded`,
}

export interface SearchResultsLoadedAction {
  type: ActionType.SearchResultsLoaded
  results: StremioMeta[]
}

export interface StreamsLoadedAction {
  type: ActionType.StreamsLoaded
  streams: StremioStream[]
}

export type Action
  = SearchResultsLoadedAction
  | StreamsLoadedAction;
