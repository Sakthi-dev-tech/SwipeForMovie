import { ImageBackground, SafeAreaView, StyleSheet, View, Animated } from "react-native";
import { COLOURS } from "../../theme/theme";
import Onboarding from 'react-native-onboarding-swiper'
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { screenDimensions } from "../../constants/screenDimensions";
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function SplashScreen({navigation}) {

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleDone = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true, // For better performance
    }).start(() => {
      AsyncStorage.setItem("hasLaunced", 'true')
      navigation.replace('SignUpScreen', {
        roundedContainerForStartingScreenHeightRatio: 0.65
      })
    });
  };



  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground source={require('../../assets/background.png')} style={styles.background}>
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
                        source={require('../../assets/Lottie/MovieAnimation.json')}
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
                        source={require('../../assets/Lottie/ManReviewingAnimation.json')}
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
                        source={require('../../assets/Lottie/WatchMovieAnimation.json')}
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
    flex: 1,
    justifyContent: 'flex-end',
  },

  roundedContainer: {
    backgroundColor: COLOURS.secondary,
    width: '100%',
    height: screenDimensions.screenHeight * 0.65,
    borderTopStartRadius: 42,
    borderTopEndRadius: 42,
    overflow: 'hidden',
    justifyContent: 'flex-start'
  },

  animation: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  getYouStartedTextContainer:{
    position: "absolute",
    height: '85%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  getYouStartedText:{
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'Catamaran'
  }

});