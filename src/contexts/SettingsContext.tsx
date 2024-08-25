import React, { createContext } from 'react';

interface MyContextValue {
  showAdultFilms: boolean;
  setShowAdultFilms: React.Dispatch<React.SetStateAction<boolean>>;
}

const SettingsContext = createContext<MyContextValue>({
  showAdultFilms: true,
  setShowAdultFilms: () => {},
});

export default SettingsContext;