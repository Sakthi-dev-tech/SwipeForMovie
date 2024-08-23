import { Animated, Image, ImageBackground, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import GoogleIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { movieDetails } from '../../api/MovieAPICall'

const MovieDetailsScreen = ({ route }) => {

  const { movieID, backdropPath, posterPath } = route.params

  const [movieDetailsData, setMovieDetailsData] = useState(undefined)

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        let response = await fetch(movieDetails(movieID))
        let movieDeets = await response.json()
        setMovieDetailsData(movieDeets)
      } catch (err) {
        console.error("Something went wrong while fetching the movie details: ", err)
      }
    }

    fetchMovieDetails()
  }, [])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require("../../assets/background.png")}>
        <Animated.ScrollView style={{flex: 1}} showsVerticalScrollIndicator={false}>
          <ImageBackground source={{ uri: backdropPath }} style={styles.backdrop}>
            <LinearGradient style={{ height: '100%' }} colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 255)']} />
          </ImageBackground>

          <View style={styles.backdrop}>
            <Image source={{ uri: posterPath }} style={styles.posterStyle}/>
          </View>

          <View style={styles.movieDeetsContainer}>
            <View style={styles.runTimeContainer}>
              <GoogleIcons name='clock' size={30} color={'gray'}/>
              <Text style={{color: 'gray'}}>
                {Math.floor(movieDetailsData?.runtime / 60)}h {' '}
                {Math.floor(movieDetailsData?.runtime % 60)}min
              </Text>
            </View>

            <Text style={styles.title}>{movieDetailsData?.title}</Text>
          </View>
        </Animated.ScrollView>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default MovieDetailsScreen

const styles = StyleSheet.create({
  backdrop: {
    width: '100%',
    aspectRatio: 3072 / 1727,
  },

  posterStyle: {
    width: '60%',
    position: 'absolute',
    aspectRatio: 200/275,
    bottom: 0,
    alignSelf:'center'
  },

  movieDeetsContainer: {
    width: '80%',
    alignSelf: 'center',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },

  runTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '28%'
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontFamily: 'PlayFair',
  }
})