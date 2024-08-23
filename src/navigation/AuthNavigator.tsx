import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/AuthScreens/SplashScreen';
import SignUpScreen from '../screens/AuthScreens/SignUpScreen';
import SignInScreen from '../screens/AuthScreens/SignInScreen';
import AppNavigator from './AppNavigator';

const Stack = createStackNavigator();


export default function AuthNavigator() {

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{headerShown: false}}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{animationEnabled: false}}/>
        <Stack.Screen name='SignInScreen' component={SignInScreen} options={{animationEnabled: false}}/>
        <Stack.Screen name='AppNavigator' component={AppNavigator} options={{animationEnabled: false}} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


