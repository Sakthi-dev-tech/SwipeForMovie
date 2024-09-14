import { getAuth } from 'firebase/auth';
import React, { createContext } from 'react';
import { AppStateStatus } from 'react-native';
import { AppState, AppStateEvent } from 'react-native';

interface MyContextValue {
  user: any,
  setUser: React.Dispatch<React.SetStateAction<any>>,
  appState: AppStateStatus,
  setAppState: React.Dispatch<React.SetStateAction<AppStateStatus>>
}

const AuthContext = createContext<MyContextValue>({
  user: undefined,
  setUser: () => {},
  appState: AppState.currentState,
  setAppState: () => {}
});

export default AuthContext;