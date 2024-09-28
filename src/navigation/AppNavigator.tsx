import React from 'react'
import { View, Image } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import MovieRecommendationScreen from '../screens/AppScreens/MovieRecommendationScreen'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLOURS } from '../theme/theme'
import HomeScreen from '../screens/AppScreens/HomeScreen'
import MovieDetailsScreen from '../screens/AppScreens/MovieDetailsScreen'
import SearchScreen from '../screens/AppScreens/SearchScreen'
import ProfileScreen from '../screens/AppScreens/ProfileScreens/ProfileScreen'
import EditProfileScreen from '../screens/AppScreens/ProfileScreens/EditProfileScreen'
import SettingsScreen from '../screens/AppScreens/ProfileScreens/SettingsScreen'
import ProfileAndSettingsScreen from '../screens/AppScreens/ProfileScreens/ProfileAndSettingsScreen'

const TabNavigator = createBottomTabNavigator()

const iconSize = 30

const AppNavigator = () => {
    return (
        <TabNavigator.Navigator initialRouteName='HomeNav' screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarStyle: {
                height: 60,
                position: 'absolute',
                bottom: 15,
                left: 15,
                right: 15,
                borderRadius: 20,
                backgroundColor: COLOURS.secondary,
            },
        }}>
            <TabNavigator.Group>
                <TabNavigator.Screen
                    name='Home'
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <MaterialCommunityIcons name='home' size={iconSize} color={focused ? COLOURS.orange : 'black'} />
                        ),
                    }}
                />
                <TabNavigator.Screen
                    name='MovieDetails'
                    component={MovieDetailsScreen}
                    options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' }
                    }}
                />
                <TabNavigator.Screen
                    name='SearchScreen'
                    component={SearchScreen}
                    options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' }
                    }}
                />
            </TabNavigator.Group>

            <TabNavigator.Screen
                name='SuggestMe'
                component={MovieRecommendationScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <View style={{
                            height: 100,
                            width: 100,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 50,
                            backgroundColor: 'black'
                        }}>
                            <View style={{
                                height: 80,
                                width: 80,
                                alignItems: 'center',
                                justifyContent: 'center',
                                backgroundColor: 'lightgray',
                                borderRadius: 50,
                            }}>
                                <Image
                                    source={require('../assets/icons/filmRollImage.png')}
                                    style={{ width: iconSize, height: iconSize, tintColor: focused ? COLOURS.orange : 'black' }}
                                />
                            </View>
                        </View>
                    ),

                }}
            />

            <TabNavigator.Group>
                <TabNavigator.Screen
                    name='Profile'
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Ionicons name='person' size={iconSize} color={focused ? COLOURS.orange : 'black'} />
                        )
                    }}
                />

                <TabNavigator.Screen 
                    name='ProfileAndSettingsScreen'
                    component={ProfileAndSettingsScreen}
                    options={{
                        tabBarButton: () => null,
                        tabBarStyle: {display: 'none'}
                    }}
                />

                <TabNavigator.Screen
                    name='EditProfile'
                    component={EditProfileScreen}
                    options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' }
                    }}
                />

                <TabNavigator.Screen
                    name='EditSettings'
                    component={SettingsScreen}
                    options={{
                        tabBarButton: () => null,
                        tabBarStyle: { display: 'none' }
                    }}
                />
            </TabNavigator.Group>
        </TabNavigator.Navigator>
    )
}

export default AppNavigator