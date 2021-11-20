import { createContext, Dispatch, useReducer } from 'react';
import { Action } from './actions';
import { appReducer, AppState } from './reducer';

export interface AppContextType {
  state: AppState;
  dispatch: Dispatch<Action>;
}

export const AppContext = createContext<AppContextType>({} as AppContextType);

export const useInitialiseAppContext = (initialState: AppState): AppContextType => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  return { state, dispatch };
};
