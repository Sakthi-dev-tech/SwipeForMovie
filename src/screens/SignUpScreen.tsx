import { Animated, ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { COLOURS } from '../theme/theme';
import { screenDimensions } from '../constants/screenDimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'

export default function SignUpScreen() {
    const animatedHeight = useRef(new Animated.Value(screenDimensions.screenHeight * 0.55)).current;
    const signUpFieldOpacity = useRef(new Animated.Value(0)).current;
    const [isReady, setIsReady] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: screenDimensions.screenHeight * 0.70,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            setIsReady(true)
        })
    }, [])

    useEffect(() => {
        if (isReady) {
            Animated.timing(signUpFieldOpacity, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            }).start()
        }
    }, [isReady])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' />
            <ImageBackground source={require('../assets/background.png')} style={styles.background}>
                <Animated.View style={[styles.roundedContainer, { height: animatedHeight }]}>
                    {
                        <Animated.View style={[styles.signUpFields, { opacity: signUpFieldOpacity }]}>
                            <View style={styles.textInputContainer}>
                                <Entypo style={styles.icon} name='user' color={COLOURS.orange} size={25} />
                                <TextInput
                                    placeholder='Username'
                                    value={username}
                                    onChangeText={text => {
                                        setUsername(text)
                                    }}
                                />
                            </View>
                            <View style={styles.textInputContainer}>
                                <Entypo style={styles.icon} name='email' color={COLOURS.orange} size={25} />
                                <TextInput
                                    placeholder='Email'
                                    keyboardType='email-address'
                                    value={email}
                                    onChangeText={text => {
                                        setEmail(text)
                                    }}
                                />
                            </View>
                            <View style={styles.textInputContainer}>
                                <AntDesign style={styles.icon} name='lock' color={COLOURS.orange} size={25} />
                                <TextInput
                                    placeholder='Password'
                                    secureTextEntry
                                    value={password}
                                    onChangeText={text => {
                                        setPassword(text)
                                    }}
                                />
                            </View>
                            <View style={styles.textInputContainer}>
                                <AntDesign style={styles.icon} name='lock' color={COLOURS.orange} size={25} />
                                <TextInput
                                    placeholder='Confirm Password'
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={text => {
                                        setConfirmPassword(text)
                                    }}
                                />
                            </View>

                            <View style={{
                                height: '100%',
                                width: '100%',
                                alignItems: 'center',
                                marginVertical: 30
                            }}>
                            <TouchableOpacity style={styles.buttonTouch}>
                                <Text style={styles.signUpText}>Sign Up</Text>
                            </TouchableOpacity>

                            <View style={{
                                flexDirection: 'row'
                            }}>
                                <Text style={styles.signInPageNavText}>Already have an account? </Text>
                                <TouchableOpacity>
                                    <Text style={[styles.signInPageNavText, {color: 'blue'}]}>Sign In</Text>
                                </TouchableOpacity>
                            </View>
                            </View>
                        </Animated.View>
                    }
                </Animated.View>
            </ImageBackground>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    background: {
        flex: 1
    },

    roundedContainer: {
        backgroundColor: COLOURS.secondary,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        borderTopStartRadius: 42,
        borderTopEndRadius: 42,
        justifyContent: 'flex-end',
        overflow: 'hidden',
    },

    signUpFields: {
        alignSelf: "center",
        width: '90%',
        height: '95%',
        overflow: 'hidden',
    },

    textInputContainer: {
        marginVertical: 20,
        height: 40,
        borderRadius: 10,
        overflow: 'hidden',
        backgroundColor: 'lightgray',
        alignItems: 'center',
        flexDirection: 'row'
    },

    icon: {
        marginHorizontal: 5
    },

    buttonTouch: {
        backgroundColor: COLOURS.orange,
        height: 70,
        width: 150,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 5
    },

    signUpText: {
        fontSize: 20,
        fontFamily: 'Lato',
        fontWeight: 'bold',
    },

    signInPageNavText: {
        fontSize: 15
    }
});