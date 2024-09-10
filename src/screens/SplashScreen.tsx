import React from "../../../../../AppData/Local/deno/npm/registry.npmjs.org/@types/react/18.3.5/index.d.ts";
import { StatusBar } from "expo-status-bar";
import { ImageBackground, SafeAreaView, StyleSheet, View, Animated } from "react-native";
import { COLOURS } from "../theme/theme.ts";
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";

export default function SplashScreen1() {
  const navigation = useNavigation()
  const [fadeAnim, setFadeAnim] = useState(useRef(new Animated.Value(1)).current); // Initial opacity: 1
  const [shouldHide, setShouldHide] = useState(false);

  const handleDone = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true, // For better performance
    }).start(() => {
      navigation.navigate("SignUpScreen")
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style='auto' />
      <ImageBackground source={require('../assets/background.png')} style={styles.background}>
        <View style={styles.roundedContainer}>
          <Animated.View style={{flex: 1, opacity: fadeAnim}}>
            <Onboarding
              onDone={() => handleDone()}
              skipToPage={2}
              containerStyles={{
                justifyContent: 'flex-start',
                marginTop: '20%'
              }}
              titleStyles={{ color: 'black', fontFamily: 'Catamaran', fontWeight: 'bold', fontSize: 30 }}
              pages={[
                {
                  backgroundColor: 'lightblue',
                  title: "Pick A Movie With Some Swipes!",
                  subtitle: '',
                  image: (
                    <View style={styles.animation}>
                      <LottieView
                        autoPlay
                        loop
                        source={require('../assets/Lottie/MovieAnimation.json')}
                        style={{ width: 150, height: 150 }}
                      />
                    </View>
                  )
                },
                {
                  backgroundColor: 'lightyellow',
                  title: "Find Movies Based On Review!",
                  subtitle: '',
                  image: (
                    <View style={styles.animation}>
                      <LottieView
                        autoPlay
                        loop
                        source={require('../assets/Lottie/ManReviewingAnimation.json')}
                        style={{ width: 200, height: 150 }}
                      />
                    </View>
                  )
                },
                {
                  backgroundColor: 'lightgray',
                  title: "Ready To Binge?",
                  subtitle: '',
                  image: (
                    <View style={styles.animation}>
                      <LottieView
                        autoPlay
                        loop
                        source={require('../assets/Lottie/WatchMovieAnimation.json')}
                        style={{ width: 200, height: 150 }}
                      />
                    </View>
                  )
                },
              ]} />
          </Animated.View>
        </View>
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
    height: 450,
    position: 'absolute',
    bottom: 0,
    borderTopStartRadius: 42,
    borderTopEndRadius: 42,
    justifyContent: 'flex-start',
    overflow: 'hidden'
  },

  animation: {
    alignItems: 'center',
    justifyContent: 'center',
  },

});