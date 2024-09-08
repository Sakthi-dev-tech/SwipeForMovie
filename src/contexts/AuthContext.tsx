import { getAuth } from 'firebase/auth';
import React, { createContext } from 'react';

interface MyContextValue {
  user: any,
  setUser: React.Dispatch<React.SetStateAction<any>>
}

const AuthContext = createContext<MyContextValue>({
  user: undefined,
  setUser: () => {}
});

export default AuthContext;