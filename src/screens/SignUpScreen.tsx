import { Animated, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { StatusBar } from 'expo-status-bar';
import { COLOURS } from '../theme/theme';

export default function SignUpScreen() {
    const animatedHeight = useRef(new Animated.Value(450)).current;
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        Animated.timing(animatedHeight, {
            toValue: 575,
            duration: 500,
            useNativeDriver: false
        }).start(() => {
            setIsReady(true)
        })
    }, [])

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style='auto' />
            <ImageBackground source={require('../assets/background.png')} style={styles.background}>
                <Animated.View style={[styles.roundedContainer, {height: animatedHeight}]}>
                    {
                        (isReady) && (
                            <Text>Hello</Text>
                        )
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
        justifyContent: 'flex-start',
        overflow: 'hidden'
    },
});