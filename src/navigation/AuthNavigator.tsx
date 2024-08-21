import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName='SplashScreen' screenOptions={{ headerShown: false }}>
        <Stack.Screen name='SplashScreen' component={SplashScreen} />
        <Stack.Screen name='SignUpScreen' component={SignUpScreen} options={{ animationEnabled: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}


