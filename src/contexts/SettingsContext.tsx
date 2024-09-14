import React, { createContext } from 'react';

interface MyContextValue {
  showAdultFilms: boolean;
  setShowAdultFilms: React.Dispatch<React.SetStateAction<boolean>>;
  temperatureForMovieRecommendation: GLfloat;
  setTemperatureForMovieRecommendations: React.Dispatch<React.SetStateAction<GLfloat>>;
}

const SettingsContext = createContext<MyContextValue>({
  showAdultFilms: true,
  setShowAdultFilms: () => {},
  temperatureForMovieRecommendation: 1.0,
  setTemperatureForMovieRecommendations: () => {}
});

export default SettingsContext;