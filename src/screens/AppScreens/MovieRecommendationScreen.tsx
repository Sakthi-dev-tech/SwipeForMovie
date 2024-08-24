import { View, Text, SafeAreaView, ImageBackground, Image, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { screenDimensions } from '../../constants/screenDimensions'
import { COLOURS } from '../../theme/theme'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { interpolate, ReduceMotion, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import { baseImagePath } from '../../api/MovieAPICall'
import { LinearGradient } from 'expo-linear-gradient'

const sampleMovieData = [
  {
    "adult": false,
    "backdrop_path": "/mDfJG3LC3Dqb67AZ52x3Z0jU0uB.jpg",
    "genre_ids": [
      12,
      28,
      878
    ],
    "id": 299536,
    "original_language": "en",
    "original_title": "Avengers: Infinity War",
    "overview": "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos. A despot of intergalactic infamy, his goal is to collect all six Infinity Stones, artifacts of unimaginable power, and use them to inflict his twisted will on all of reality. Everything the Avengers have fought for has led up to this moment - the fate of Earth and existence itself has never been more uncertain.",
    "popularity": 352.831,
    "poster_path": "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
    "release_date": "2018-04-25",
    "title": "Avengers: Infinity War",
    "video": false,
    "vote_average": 8.246,
    "vote_count": 29319
  },
  {
    "adult": false,
    "backdrop_path": "/9BBTo63ANSmhC4e6r62OJFuK2GL.jpg",
    "genre_ids": [
      878,
      28,
      12
    ],
    "id": 24428,
    "original_language": "en",
    "original_title": "The Avengers",
    "overview": "When an unexpected enemy emerges and threatens global safety and security, Nick Fury, director of the international peacekeeping agency known as S.H.I.E.L.D., finds himself in need of a team to pull the world back from the brink of disaster. Spanning the globe, a daring recruitment effort begins!",
    "popularity": 211.869,
    "poster_path": "/RYMX2wcKCBAr24UyPD7xwmjaTn.jpg",
    "release_date": "2012-04-25",
    "title": "The Avengers",
    "video": false,
    "vote_average": 7.717,
    "vote_count": 30403
  },
  {
    "adult": false,
    "backdrop_path": "/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg",
    "genre_ids": [
      12,
      878,
      28
    ],
    "id": 299534,
    "original_language": "en",
    "original_title": "Avengers: Endgame",
    "overview": "After the devastating events of Avengers: Infinity War, the universe is in ruins due to the efforts of the Mad Titan, Thanos. With the help of remaining allies, the Avengers must assemble once more in order to undo Thanos' actions and restore order to the universe once and for all, no matter what consequences may be in store.",
    "popularity": 226.753,
    "poster_path": "/or06FN3Dka5tukK1e9sl16pB3iy.jpg",
    "release_date": "2019-04-24",
    "title": "Avengers: Endgame",
    "video": false,
    "vote_average": 8.252,
    "vote_count": 25274
  },
]
const MovieRecommendationScreen = (props) => {
  const [index, setIndex] = useState(0)

  const hiddenTranslateX = screenDimensions.screenWidth * 2
  const VELOCITY = 800

  const translationX = useSharedValue(0);
  const rotateDeg = useDerivedValue(() => interpolate(
    translationX.value,
    [-screenDimensions.screenWidth, 0, screenDimensions.screenWidth],
    [-60, 0, 60]
  ));

  const pan = Gesture.Pan()
    .onChange((event) => {
      translationX.value = event.translationX

    }).onEnd((event) => {
      if (Math.abs(event.velocityX) < 800){
        translationX.value = 0
        return;
      } 

      if (event.velocityX > 0){
        // swipe right
        translationX.value = hiddenTranslateX
      } else {
        // swipe left
        translationX.value = -hiddenTranslateX
      }

    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withSpring(translationX.value) },
      { rotate: withSpring(`${rotateDeg.value}deg`) }
    ]
  }))

  const nextCardStyle = useAnimatedStyle(() => ({
    opacity: withSpring(interpolate(
      Math.abs(translationX.value),
      [0, hiddenTranslateX],
      [0.8, 1]
    )),
    transform: [
      {
        scale: withSpring(interpolate(
          Math.abs(translationX.value),
          [0, hiddenTranslateX],
          [0.8, 1]
        ))
      }
    ]
  }))


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../assets/background.png')}>
        <Text style={styles.header}>Suggest Me</Text>

        <View style={styles.movieCards}>

          <Animated.View style={[styles.nextMovieCard, nextCardStyle]}>
            <Image source={{ uri: baseImagePath("w500", sampleMovieData[index + 1].poster_path) }} style={styles.movieCardPoster} />
            <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,100)']} style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                <Text style={styles.movieTitle}>{sampleMovieData[index + 1].original_title}</Text>
            </LinearGradient>
          </Animated.View>

          <GestureDetector gesture={pan}>
            <Animated.View style={[styles.movieCard, cardStyle]}>
              <Image source={{ uri: baseImagePath("w500", sampleMovieData[index].poster_path) }} style={styles.movieCardPoster} />
              <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,100)']} style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                <Text style={styles.movieTitle}>{sampleMovieData[index].original_title}</Text>
              </LinearGradient>
            </Animated.View>
          </GestureDetector>

        </View>
      </ImageBackground>
    </SafeAreaView>
  )

}

export default MovieRecommendationScreen

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'Catamaran',
    color: 'white',
    paddingTop: screenDimensions.StatusBarHeight + 5
  },

  movieCards: {
    height: '60%',
    aspectRatio: 2 / 3,
    marginTop: 30,
    borderRadius: 20,
  },

  movieCard: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: COLOURS.secondary,
  },

  movieCardPoster: {
    flex: 1
  },

  nextMovieCard: {
    ...StyleSheet.absoluteFillObject,
  },

  movieTitle:{
    color: 'white',
    margin: 10,
    fontFamily: 'PoppinsBold'
  }
})