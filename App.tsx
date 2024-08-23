import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { useEffect, useState } from 'react';
import * as Font from 'expo-font'
import { StatusBar } from 'expo-status-bar';

const Stack = createStackNavigator();

export default function App() {

  const [fontLoaded, isFontLoaded] = useState(false)

  useEffect(() => {
    Font.loadAsync({
      'Catamaran': require('./src/assets/fonts/Catamaran-VariableFont_wght.ttf'),
      'Lato': require('./src/assets/fonts/Lato-Regular.ttf'),
      'PlayFair': require('./src/assets/fonts/PlayfairDisplay-VariableFont_wght.ttf')
    }).then(() => isFontLoaded(true));
  }, []);

  if (fontLoaded) {
    return (
      <>
        <StatusBar style='auto' networkActivityIndicatorVisible={false}/>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='AuthNavigator' screenOptions={{ headerShown: false }}>
            <Stack.Screen name='AuthNavigator' component={AuthNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </>
    );
  }

}


