import React from 'react';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/AuthScreens/SplashScreen';
import SignUpScreen from '../screens/AuthScreens/SignUpScreen';
import SignInScreen from '../screens/AuthScreens/SignInScreen';
import AppNavigator from './AppNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useContext, useEffect, useState } from 'react';
import AuthContext from '../contexts/AuthContext';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  const { user, setUser } = useContext(AuthContext)
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  // check if this is the first launch to not show the splash screen
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean>(false)
  const [isLoaded, setIsLoaded] = useState<boolean>(false)

  useEffect(() => {
    if ( user == null || user == 'null' ){
      setAuthenticated(false)
    } else {
      setAuthenticated(true)
    }
  }, [user])

  useEffect(() => {
    const checkFirstLaunch = async () => {
      try {
        const hasLaunched = await AsyncStorage.getItem('hasLaunced')

        if (hasLaunched === null) {
          setIsFirstLaunch(true)
        } else if (hasLaunched === 'true') {
          setIsFirstLaunch(false)
        }

      } catch (err) {
        console.error("Something wrong when checking if this is the first launch: ", err)
      } finally {
        setIsLoaded(true)
      }
    }

    checkFirstLaunch()
  }, [])

  if (isLoaded) {
    if (!authenticated) {
      return (
        <Stack.Navigator initialRouteName={isFirstLaunch ? 'SplashScreen' : "SignInScreen"} screenOptions={{ headerShown: false }}>
          {
            isFirstLaunch && (
              <Stack.Screen name='SplashScreen' component={SplashScreen} />
            )
          }
          <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{ animationEnabled: false }} initialParams={{ roundedContainerForStartingScreenHeightRatio: 0 }} />
          <Stack.Screen name='SignInScreen' component={SignInScreen} options={{ animationEnabled: false }} initialParams={{ roundedContainerForStartingScreenHeightRatio: 0 }} />
        </Stack.Navigator>
      )
    } else {
      return (
        <NavigationContainer independent={true}>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name='AppNavigator' component={AppNavigator} options={{ animationEnabled: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
  }
}


