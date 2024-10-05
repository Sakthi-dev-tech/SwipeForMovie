import { Animated, ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput, Text, ScrollView } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { COLOURS } from '../../theme/theme';
import { screenDimensions } from '../../constants/screenDimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { AUTH } from '../../../firebase.config';
import AuthContext from '../../contexts/AuthContext';
import { FirebaseError } from 'firebase/app';

export default function SignInScreen({ navigation, route }) {

    const { user, setUser } = useContext(AuthContext)

    const { roundedContainerForStartingScreenHeightRatio } = route?.params

    const animatedHeight = useRef(new Animated.Value(roundedContainerForStartingScreenHeightRatio ? screenDimensions.screenHeight * roundedContainerForStartingScreenHeightRatio : 0)).current;
    const signUpFieldOpacity = useRef(new Animated.Value(0)).current;
    const [isReady, setIsReady] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        // Subscribe to the user's authentication state
        const unsubscribe = onAuthStateChanged(AUTH, (currentUser) => {
          if (currentUser) {
            setUser(currentUser);
          } else {
            setUser(null); // User is signed out
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, [AUTH]);

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: screenDimensions.screenHeight * 0.40,
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

    async function handleSignIn() {
        try {
            await signInWithEmailAndPassword(AUTH, email, password).then(async (userCreds) => {
                setUser(getAuth().currentUser)
            });
        } catch (error) {
            if (error instanceof FirebaseError) {
                if (error.code === 'auth/invalid-credential') {
                    alert("Your current password is invalid");
                } else if (error.code === 'auth/user-mismatch') {
                    alert("Provided credentials do not match any user!");
                } else if (error.code === 'auth/weak-password') {
                    alert("Passowrd is too weak! Choose a password that is at least 6 characters long!");
                } else if (error.code === 'auth/too-many-requests') {
                    alert("Too many requests! Try again later!");
                } else {
                    console.error('Error in Sign In Screen: ', error);
                }
            }
        }

    }

    function handleNavToSignUp() {
        navigation.replace('SignUpScreen', {
            roundedContainerForStartingScreenHeightRatio: 0.40
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' />
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <Animated.View style={[styles.roundedContainer, { height: animatedHeight }]}>
                    {
                        <Animated.View style={[styles.signUpFields, { opacity: signUpFieldOpacity }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.textInputContainer}>
                                    <Entypo style={styles.icon} name='email' color={COLOURS.orange} size={25} />
                                    <TextInput
                                        cursorColor={COLOURS.orange}
                                        style={styles.textInput}
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
                                        cursorColor={COLOURS.orange}
                                        style={styles.textInput}
                                        placeholder='Password'
                                        secureTextEntry
                                        value={password}
                                        onChangeText={text => {
                                            setPassword(text)
                                        }}
                                    />
                                </View>

                                <View style={{
                                    height: '100%',
                                    width: '100%',
                                    alignItems: 'center',
                                }}>
                                    <TouchableOpacity style={styles.buttonTouch} onPress={() => handleSignIn()}>
                                        <Text style={styles.signInText}>Sign In</Text>
                                    </TouchableOpacity>

                                    <View style={{
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={styles.signUpPageNavText}>Don't have an account? </Text>
                                        <TouchableOpacity onPress={() => { handleNavToSignUp() }}>
                                            <Text style={[styles.signUpPageNavText, { color: 'blue' }]}>Sign Up</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
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

    textInput: {
        flex: 1,
        height: '100%'
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
        marginVertical: 5
    },

    signInText: {
        fontSize: 20,
        fontFamily: 'Lato',
        fontWeight: 'bold',
    },

    signUpPageNavText: {
        fontSize: 15
    },

    signInWithGoogleButton: {
        backgroundColor: 'white',
        width: 170,
        height: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'black',
        marginTop: 10,
        marginBottom: 10
    }
});