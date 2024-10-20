import { View, Text, SafeAreaView, ImageBackground, Image, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { screenDimensions } from '../../constants/screenDimensions'
import { COLOURS } from '../../theme/theme'
import { GestureDetector, Gesture } from 'react-native-gesture-handler'
import Animated, { interpolate, runOnJS, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated'
import { baseImagePath } from '../../api/MovieAPICall'
import { LinearGradient } from 'expo-linear-gradient'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { supabase } from '../../Embeddings/supabase'
import AuthContext from '../../contexts/AuthContext'
import { useIsFocused } from '@react-navigation/native'
import SettingsContext from '../../contexts/SettingsContext'
import { Snackbar } from 'react-native-paper'

// I need title, overview and poster path

// const { data, error } = await supabase.functions.invoke('embed_for_users', {
//   body: { inputs: ["Hello, World!", "You are awesome!", "OMG"] },
// })

const MovieRecommendationScreen = (props) => {

  const isFocused = useIsFocused()
  const { appState } = useContext(AuthContext)

  const [listOfRecommendedMovies, setListOfRecommendedMovies] = useState<any>([])

  const { user } = useContext(AuthContext)
  const { showAdultFilms, temperatureForMovieRecommendation } = useContext(SettingsContext)

  const [snackBarMessage, setSnackBarMessage] = useState<string>('');
  const [snackBarVisible, setSnackBarVisible] = useState<boolean>(false);

  const [likedMoviesData, setLikedMoviesData] = useState<any>([])
  const [dislikedMoviesData, setDislikedMoviesData] = useState<any>([])
  const [overviews, setOverviews] = useState<string[]>([])

  const [userAvgEmbedding, setUserAvgEmbedding] = useState<any>()

  const [updateRecommendedMovies, setUpdateRecommendedMovies] = useState<boolean>(true)

  const [currCardindex, setCurrCardIndex] = useState(0)
  const [nextCardIndex, setNextCardIndex] = useState(1)

  const hiddenTranslateX = screenDimensions.screenWidth * 2
  const VELOCITY_LIMIT = 900

  const translationX = useSharedValue(0);
  const rotateDeg = useDerivedValue(() => interpolate(
    translationX.value,
    [-hiddenTranslateX, 0, hiddenTranslateX],
    [-75, 0, 75]
  ));

  useEffect(() => {
    if (!isFocused || !(appState === 'active')) {
      // update the data in supabase when we go out of this screen or app
      const updateTheLikedAndDislikedMoviesInDB = async () => {
        const { data, error } = await supabase
          .from('UsersMovieData')
          .update({
            liked_movies: likedMoviesData,
            disliked_movies: dislikedMoviesData
          })
          .eq("userID", user.uid)
      }

      updateTheLikedAndDislikedMoviesInDB();
    }

    if (isFocused) {
      setUpdateRecommendedMovies(true)
    }
  }, [isFocused])

  // add the swiped left movie to the dislike movies list
  function handleRecommendedMovieDisliked(movie) {
    setDislikedMoviesData([...dislikedMoviesData, movie])
  }

  // add the swiped right movie to the liked movies list
  function handleRecommendedMovieLiked(movie) {
    setLikedMoviesData([...likedMoviesData, movie])
  }

  // this function fetches the recommended movies for the user using the average vector from the user's liked movies
  const fetchRecommendedMovies = async (embedding) => {
    const { data, error } = await supabase.rpc("match_movies", {
      query_embedding: embedding,
      match_threshold: temperatureForMovieRecommendation,
      match_count: 4,
      query_adult: showAdultFilms,
      liked_movies: likedMoviesData,
      disliked_movies: dislikedMoviesData
    })

    if (error) {
      console.error(error)
      setSnackBarMessage("Oh no! Something went wrong! Try again!")
      setSnackBarVisible(true)
    } else if (data.length === 0) {
      setSnackBarMessage("No movies found! Try reducing the similarity value for movies to be recommended!")
      setSnackBarVisible(true)
    } else {
      setListOfRecommendedMovies(data)
    }
  }

  // this function calculates the average embedding for the user
  const getAvgEmbeddingForUser = async (overviews) => {
    try {
      await Promise.all(likedMoviesData)

      const { data, error } = await supabase.functions.invoke('embed_for_users', {
        body: JSON.stringify({ inputs: overviews }),
      })

      if (error) {
        console.error(error)
        setSnackBarMessage("Oh no! Something went wrong! Try again!")
        setSnackBarVisible(true)
      }

      if (data) {
        setUserAvgEmbedding(data.averageEmbedding)
      }
    } catch (err) {
      console.error("Error: ", err)
    }
  }

  // this should get the recommended movies to show the user using the current liked movies list
  useEffect(() => {
    if (updateRecommendedMovies === true && likedMoviesData && likedMoviesData.length > 0) {
      try {
        const fetchedOverviews = likedMoviesData.map(movies => movies.overview)
        setOverviews(fetchedOverviews)
      } finally {
        setUpdateRecommendedMovies(false)
      }
    }
  }, [updateRecommendedMovies, likedMoviesData])

  // when the list of overviews change, get the average embedding for the list of overviews
  useEffect(() => {
    if (overviews && overviews.length > 0) {
      getAvgEmbeddingForUser(overviews)
    }
  }, [overviews])

  // when the average embedding changes, fetch the recommended movies for that embedding
  useEffect(() => {
    if (userAvgEmbedding) {
      fetchRecommendedMovies(userAvgEmbedding)
    }
  }, [userAvgEmbedding])

  // when the list of recommended movies change, change the index of the cards back to the original
  useEffect(() => {
    if (listOfRecommendedMovies) {
      setCurrCardIndex(0)
      setNextCardIndex(1)
    }
  }, [listOfRecommendedMovies])


  function changeCard(sign) {
    try {
      const movieToUpdate = Object.fromEntries(
        Object.entries(listOfRecommendedMovies[currCardindex]).filter(([key]) => key !== 'similarity')
      )
      if (sign < 0) {
        handleRecommendedMovieDisliked(movieToUpdate)
      } else {
        handleRecommendedMovieLiked(movieToUpdate)
      }
    } finally {
      translationX.value = 0
      setCurrCardIndex(nextCardIndex)
      if (nextCardIndex + 1 >= listOfRecommendedMovies.length) {
        setNextCardIndex(Infinity)
      } else {
        setNextCardIndex(nextCardIndex + 1)
      }
    }
  }

  useEffect(() => {
    // update the recommended movies when there is only 1 movie left in recommendation
    if (listOfRecommendedMovies && listOfRecommendedMovies.length === 0) {
      setUpdateRecommendedMovies(true)
    }
  }, [listOfRecommendedMovies])

  const pan = Gesture.Pan()
    .onChange((event) => {
      translationX.value = withSpring(event.translationX)

    }).onEnd((event) => {
      if (Math.abs(event.velocityX) < VELOCITY_LIMIT) {
        translationX.value = withSpring(0)
        return;
      }

      translationX.value = withSpring(
        hiddenTranslateX * Math.sign(event.velocityX),
        { duration: 30 },
        () => runOnJS(changeCard)(1 * Math.sign(event.velocityX))
      )


    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
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

  const likeAnimation = useAnimatedStyle(() => ({
    opacity: withSpring(interpolate(
      translationX.value,
      [-hiddenTranslateX, 0, screenDimensions.screenWidth],
      [0.5, 0.5, 1]
    )),

    transform: [
      {
        translateX: withSpring(interpolate(
          translationX.value,
          [-hiddenTranslateX, 0, screenDimensions.screenWidth],
          [0.95 * screenDimensions.screenWidth + 30, 0.95 * screenDimensions.screenWidth + 30, 0.3 * screenDimensions.screenWidth + 30]
        ))
      },

      {
        scale: withSpring(interpolate(
          translationX.value,
          [-hiddenTranslateX, 0, screenDimensions.screenWidth],
          [1, 1, 2.0]
        ))
      }
    ]
  }))

  const dislikeAnimation = useAnimatedStyle(() => ({
    opacity: withSpring(interpolate(
      translationX.value,
      [-screenDimensions.screenWidth, 0, hiddenTranslateX],
      [1, 0.4, 0.4]
    )),

    transform: [
      {
        translateX: withSpring(interpolate(
          translationX.value,
          [-screenDimensions.screenWidth, 0, hiddenTranslateX],
          [0.3 * screenDimensions.screenWidth + 30, -0.15 * screenDimensions.screenWidth - 60, -0.15 * screenDimensions.screenWidth - 60]
        ))
      },

      {
        scale: withSpring(interpolate(
          translationX.value,
          [-screenDimensions.screenWidth, 0, hiddenTranslateX],
          [2.0, 1, 1]
        ))
      }
    ]
  }))


  useEffect(() => {
    const fetchLikedMovies = async () => {
      const { data: likedMoviesDataFetched, error } = await supabase
        .from("UsersMovieData")
        .select("liked_movies")
        .eq('userID', user.uid)

      if (error) {
        throw error
      }

      setLikedMoviesData(likedMoviesDataFetched[0].liked_movies)
    }

    const fetchDislikedMovies = async () => {
      const { data: dislikedMoviesDataFetched, error } = await supabase
        .from("UsersMovieData")
        .select("disliked_movies")
        .eq('userID', user.uid)

      if (error) {
        throw error
      }

      setDislikedMoviesData(dislikedMoviesDataFetched[0].disliked_movies)
    }

    fetchLikedMovies();
    fetchDislikedMovies();
  }, [isFocused])

  if (likedMoviesData && likedMoviesData.length === 0) {
    return (
      <ImageBackground style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }} source={require('../../assets/background.png')}>
        <Text style={{ color: 'white', fontFamily: 'PoppinsBold' }}>Like some movies to get some recommendations!</Text>
      </ImageBackground>
    )
  } else if (listOfRecommendedMovies && listOfRecommendedMovies.length > 0 && listOfRecommendedMovies[currCardindex].poster_path) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../assets/background.png')}>
          <Text style={styles.header}>Suggest Me</Text>

          <View style={styles.movieCards}>

            <Animated.View style={[styles.dislikeAnimation, dislikeAnimation]}>
              <Fontisto name='dislike' size={40} color={COLOURS.red} />
            </Animated.View>
            {nextCardIndex !== Infinity ? (
              <Animated.View style={[styles.nextMovieCard, nextCardStyle]}>
                <Image source={{ uri: baseImagePath("w500", listOfRecommendedMovies[nextCardIndex].poster_path) }} style={styles.movieCardPoster} />
                <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0, 0.85)', 'rgba(0,0,0,1)']} style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                  <Text style={styles.movieTitle}>{listOfRecommendedMovies[nextCardIndex].title}</Text>
                  <Text style={styles.movieOverview}>{listOfRecommendedMovies[currCardindex].overview}</Text>
                </LinearGradient>
              </Animated.View>
            ) : (
              <View />
            )}
            {
              currCardindex !== Infinity ? (
                <GestureDetector gesture={pan}>
                  <Animated.View style={[styles.movieCard, cardStyle]}>
                    <Image source={{ uri: baseImagePath("w500", listOfRecommendedMovies[currCardindex].poster_path) }} style={styles.movieCardPoster} />
                    <LinearGradient colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0, 0.85)', 'rgba(0,0,0,1)']} style={{ position: 'absolute', width: '100%', height: '100%', justifyContent: 'flex-end' }}>
                      <Text style={styles.movieTitle}>{listOfRecommendedMovies[currCardindex].title}</Text>
                      <Text style={styles.movieOverview}>{listOfRecommendedMovies[currCardindex].overview}</Text>
                    </LinearGradient>
                  </Animated.View>
                </GestureDetector>
              ) : (
                <ActivityIndicator
                  style={{ flex: 1, backgroundColor: 'transparent' }}
                  color={COLOURS.orange}
                  size={'large'}
                />
              )
            }

            <Animated.View style={[styles.dislikeAnimation, styles.likeAnimation, likeAnimation]}>
              <Fontisto name='like' size={40} color={COLOURS.green} />
            </Animated.View>
          </View>

          <Snackbar
            visible={snackBarVisible}
            onDismiss={() => setSnackBarVisible(false)}
            duration={2000}
            style={{ backgroundColor: COLOURS.settingsBackgroud }}
          >
            <Text style={{ color: COLOURS.orange }}>{snackBarMessage}</Text>
          </Snackbar>
        </ImageBackground>
      </SafeAreaView>
    )
  } else {
    return (
      <ImageBackground style={{ flex: 1 }} source={require('../../assets/background.png')}>
        <ActivityIndicator
          style={{ flex: 1, backgroundColor: 'transparent' }}
          size={'large'}
          color={COLOURS.orange}
        />
      </ImageBackground>
    )
  }

}

export default MovieRecommendationScreen

const styles = StyleSheet.create({
  header: {
    alignSelf: 'center',
    fontSize: 35,
    fontFamily: 'PoppinsBold',
    color: 'white',
    paddingTop: screenDimensions.StatusBarHeight + 10
  },

  movieCards: {
    height: '60%',
    aspectRatio: 2 / 3,
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  movieCard: {
    flex: 1,
    borderWidth: 1,
    backgroundColor: 'black',
    borderColor: COLOURS.secondary,
    borderRadius: 20,
    overflow: 'hidden'
  },

  dislikeAnimation: {
    position: 'absolute',
    aspectRatio: 1,
    width: 70,
    borderRadius: 100,
    backgroundColor: 'transparent',
    borderWidth: 5,
    borderColor: COLOURS.red,
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },

  movieCardPoster: {
    flex: 1
  },

  likeAnimation: {
    borderColor: COLOURS.green,
  },

  nextMovieCard: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 20,
    overflow: 'hidden'
  },

  movieTitle: {
    color: 'white',
    margin: 10,
    fontFamily: 'PoppinsBold'
  },

  movieOverview: {
    color: 'white',
    marginLeft: 10,
    marginBottom: 10,
    fontFamily: 'Poppins',
    fontSize: 12
  }
})