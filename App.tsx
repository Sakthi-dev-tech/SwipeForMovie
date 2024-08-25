import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font'
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SettingsContext from './src/contexts/SettingsContext';

const Stack = createStackNavigator();

export default function App() {

  const [fontLoaded, isFontLoaded] = useState(false)
  const [showAdultFilms, setShowAdultFilms] = useState(true)

  useEffect(() => {
    Font.loadAsync({
      'Catamaran': require('./src/assets/fonts/Catamaran-VariableFont_wght.ttf'),
      'Lato': require('./src/assets/fonts/Lato-Regular.ttf'),
      'PlayFair': require('./src/assets/fonts/PlayfairDisplay-VariableFont_wght.ttf'),
      'PoppinsBold': require('./src/assets/fonts/Poppins-Bold.ttf'),
      'Poppins': require('./src/assets/fonts/Poppins-Regular.ttf'),
      'BrandonGrotesqueMedium': require('./src/assets/fonts/HvDTrial_Brandon_Grotesque_medium-BF64a625c84a521.otf'),
      'Quicksand': require('./src/assets/fonts/Quicksand-VariableFont_wght.ttf')
    }).then(() => isFontLoaded(true));
  }, []);

  if (fontLoaded) {
    return (
      <SafeAreaProvider>
        <SettingsContext.Provider value={{ showAdultFilms, setShowAdultFilms }}>
          <StatusBar style='auto' networkActivityIndicatorVisible={false} />
          <NavigationContainer>
            <Stack.Navigator initialRouteName='AuthNavigator' screenOptions={{ headerShown: false }}>
              <Stack.Screen name='AuthNavigator' component={AuthNavigator} />
            </Stack.Navigator>
          </NavigationContainer>
        </SettingsContext.Provider>
      </SafeAreaProvider>
    );
  }

}


