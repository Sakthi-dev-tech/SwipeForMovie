import { Animated, ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, View, TextInput, Text, ScrollView } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { COLOURS } from '../../theme/theme';
import { screenDimensions } from '../../constants/screenDimensions';
import Entypo from 'react-native-vector-icons/Entypo'
import AntDesign from 'react-native-vector-icons/AntDesign'
import { createUserWithEmailAndPassword, GoogleAuthProvider, sendEmailVerification, signInWithPopup } from 'firebase/auth';
import { AUTH, FIRESTORE } from '../../../firebase.config'
import { collection, doc, setDoc } from 'firebase/firestore';
import { supabase } from '../../Embeddings/supabase';
import { FirebaseError } from 'firebase/app';
import { Snackbar } from 'react-native-paper';

export default function SignUpScreen({ navigation, route }) {

    const { roundedContainerForStartingScreenHeightRatio } = route?.params

    const animatedHeight = useRef(new Animated.Value(
        roundedContainerForStartingScreenHeightRatio ?
            screenDimensions.screenHeight * roundedContainerForStartingScreenHeightRatio :
            0
    )).current;
    const signUpFieldOpacity = useRef(new Animated.Value(0)).current;

    const [isReady, setIsReady] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [snackBarMessage, setSnackBarMessage] = useState<string>('');
    const [snackBarVisible, setSnackBarVisible] = useState<boolean>(false);

    async function handleSignUp() {
        if (username === '' || email === '' || password === '' || confirmPassword === '') {
            setSnackBarMessage("Please ensure all fields are filled up!")
            setSnackBarVisible(true)
        } else if (password !== confirmPassword) {
            setSnackBarMessage("Passwords do not match!")
            setSnackBarVisible(true)
        } else {
            try {
                await createUserWithEmailAndPassword(AUTH, email, password).then(async (userCredentials) => {
                    const user = userCredentials.user

                    await sendEmailVerification(user).then(() => {
                        setSnackBarMessage("Verification Email Sent! Please verify your account!")
                        setSnackBarVisible(true)
                    })
    
                    await setDoc(
                        doc(collection(FIRESTORE, "userSettings"), user.uid),
                        {
                            adult: false,
                            temperature: 0.70,
                        }
                    )
                    
                    await setDoc(
                        doc(collection(FIRESTORE, "userInfo"), user.uid),
                        {
                            username: username,
                            email: email,
                        }
                    )
    
                    await setDoc(
                        doc(collection(FIRESTORE, "userFollowing"), user.uid),
                        {
                            following: []
                        }
                    )
    
                    const { data, error } = await supabase
                        .from('UsersMovieData')
                        .insert([
                            {
                                userID: user.uid,
                                liked_movies: [],
                                disliked_movies: []
                            }
                        ])
                        .select()
                })
            } catch (err) {
                if (err instanceof FirebaseError) {
                    if (err.code === 'auth/invalid-credential') {
                        setSnackBarMessage("Your current password is invalid");
                    } else if (err.code === 'auth/user-mismatch') {
                        setSnackBarMessage("Provided credentials do not match any user!");
                    } else if (err.code === 'auth/weak-password') {
                        setSnackBarMessage("Passowrd is too weak! Choose a password that is at least 6 characters long!");
                    } else if (err.code === 'auth/too-many-requests') {
                        setSnackBarMessage("Too many requests! Try again later!");
                    } else if (err.code === 'auth/missing-password') {
                        setSnackBarMessage("Enter your password!")
                    } else if (err.code === 'auth/user-disabled') {
                        setSnackBarMessage("This user has been disabled! Contact the admin!")
                    } else {
                        setSnackBarMessage("Something went wrong!")
                        console.error('Error in Sign In Screen: ', err);
                    }
                }
            } finally {
                navigation.replace("SignInScreen", {
                    roundedContainerForStartingScreenHeightRatio: 0.65
                })
            }
        }
    }

    function handleNavToSignInPage() {
        navigation.replace("SignInScreen", {
            roundedContainerForStartingScreenHeightRatio: 0.65
        })
    }

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: screenDimensions.screenHeight * 0.65,
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
            <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
                <Animated.View style={[styles.roundedContainer, { height: animatedHeight }]}>
                    {
                        <Animated.View style={[styles.signUpFields, { opacity: signUpFieldOpacity }]}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <View style={styles.textInputContainer}>
                                    <Entypo style={styles.icon} name='user' color={COLOURS.orange} size={25} />
                                    <TextInput
                                        placeholder='Username'
                                        value={username}
                                        style={{ width: '100%' }}
                                        onChangeText={text => {
                                            setUsername(text)
                                        }}
                                    />
                                </View>
                                <View style={styles.textInputContainer}>
                                    <Entypo style={styles.icon} name='email' color={COLOURS.orange} size={25} />
                                    <TextInput
                                        placeholder='Email'
                                        style={{ width: '100%' }}
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
                                        style={styles.textInput}
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
                                        style={styles.textInput}
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
                                    marginVertical: 15
                                }}>
                                    <TouchableOpacity style={styles.buttonTouch} onPress={() => handleSignUp()}>
                                        <Text style={styles.signUpText}>Sign Up</Text>
                                    </TouchableOpacity>

                                    <View style={{
                                        flexDirection: 'row'
                                    }}>
                                        <Text style={styles.signInPageNavText}>Already have an account? </Text>
                                        <TouchableOpacity onPress={() => handleNavToSignInPage()}>
                                            <Text style={[styles.signInPageNavText, { color: 'blue' }]}>Sign In</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ScrollView>
                        </Animated.View>

                    }
                </Animated.View>
                <Snackbar
                visible={snackBarVisible}
                onDismiss={() => setSnackBarVisible(false)}
                duration={2000}
                style={{backgroundColor: COLOURS.settingsBackgroud}}
            >
                <Text style={{color: COLOURS.orange}}>{snackBarMessage}</Text>
            </Snackbar>
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
        flexDirection: 'row',
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
        marginBottom: 5
    },

    signUpText: {
        fontSize: 20,
        fontFamily: 'Lato',
        fontWeight: 'bold',
    },

    signInPageNavText: {
        fontSize: 15
    },

    signUpWithGoogleButton: {
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
    }
});