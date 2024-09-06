import { ActivityIndicator, Animated, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import GoogleIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { baseImagePath, movieCastDetails, movieDetails, movieReviews } from '../../api/MovieAPICall'
import { COLOURS } from '../../theme/theme'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useIsFocused, useNavigation } from '@react-navigation/native'
import { screenDimensions } from '../../constants/screenDimensions'
import CastRenderItem from '../../components/ForMovieDetailsScreen/CastRenderItem'
import ReviewCard from '../../components/ForMovieDetailsScreen/ReviewCard'

const StatusBarHeight = screenDimensions.StatusBarHeight || 0

const MovieDetailsScreen = ({ navigation, route }) => {

  const { fromSearchScreen, movieID, backdropPath, posterPath, fromProfile } = route.params
  
  const isFocused = useIsFocused()
  
  const [movieDetailsData, setMovieDetailsData] = useState<any>(undefined)
  const [castDetailsData, setCastDetailsData] = useState<any>(undefined)
  const [reviewsData, setReviewsData] = useState<any>(undefined)
  
  const scrollViewRef = useRef<ScrollView>(null)
  const flatListRef = useRef<FlatList<any>>(null);

  const [isMovieLiked, setIsMovieLiked] = useState<boolean>(false)
  const [isMovieDisliked, setIsMovieDisliked] = useState<boolean>(false)

  useEffect(() => {
    // to make sure your cast flatlist starts from index 0 for the flatlist to have time to initialise all items
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false })

    const fetchMovieDetails = async () => {
      try {
        let response = await fetch(movieDetails(movieID))
        let movieDeets = await response.json()
        setMovieDetailsData(movieDeets)
      } catch (err) {
        console.error("Something went wrong while fetching the movie details: ", err)
      }
    }

    const fetchMovieCastDetails = async () => {
      try {
        let response = await fetch(movieCastDetails(movieID))
        let castDeets = await response.json()
        setCastDetailsData(castDeets.cast)
      } catch (err) {
        console.error("Something went wrong while fetching the cast details: ", err)
      }
    }

    const fetchReviews = async () => {
      try {
        let response = await fetch(movieReviews(movieID))
        let reviewDeets = await response.json()
        setReviewsData(reviewDeets.results)
      } catch (err) {
        console.error("Something went wrong while fetching the review details: ", err)
      }
    }

    fetchMovieDetails()
    fetchMovieCastDetails()
    fetchReviews()
  }, [isFocused])

  if (movieDetailsData == undefined) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: 'black' }} size={'large'} color={COLOURS.orange} />
  }

  function handlePressDislike() {
    setIsMovieDisliked(true)
    if (isMovieLiked){
      setIsMovieLiked(false)
    }
  }
  
  function handlePressLike() {
    setIsMovieLiked(true)
    if (isMovieDisliked) {
      setIsMovieDisliked(false)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require("../../assets/background.png")}>

        <TouchableOpacity style={styles.goBackIconContainer} onPress={() => {
          if (fromSearchScreen) {
            navigation.navigate("SearchScreen")
          } else if (fromProfile) {
            navigation.navigate("Profile")
          } else {
            navigation.navigate("Home")
          }
          scrollViewRef?.current?.scrollTo({y: 0, animated: false})
        }}>
          <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
        </TouchableOpacity>

        <ScrollView ref={scrollViewRef} style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

          {/* Backdrop */}
          <ImageBackground source={{ uri: backdropPath }} style={styles.backdrop}>


            <LinearGradient style={{ height: '100%' }} colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 255)']} />
          </ImageBackground>

          {/* Movie Poster */}
          <View style={styles.backdrop}>
            <Image source={{ uri: posterPath }} style={styles.posterStyle} />
          </View>

          <View style={styles.movieDeetsContainer}>
            <View style={styles.runTimeContainer}>
              <GoogleIcons name='clock' size={30} color={'gray'} />
              <Text style={{ color: 'gray' }}>
                {Math.floor(movieDetailsData?.runtime / 60)}h {' '}
                {Math.floor(movieDetailsData?.runtime % 60)}min
              </Text>
            </View>

            <Text style={styles.title}>{movieDetailsData?.title}</Text>

            {/* Genre Display */}
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              {
                movieDetailsData.genres.slice(0, 4).map((item) => {
                  return (
                    <View style={styles.genreContainer} key={item.id}>
                      <Text style={{ color: 'gray', fontWeight: 'bold', fontSize: 10 }}>{item.name}</Text>
                    </View>
                  )
                })
              }
            </View>

            <View style={styles.ratingContainer}>
              <Image source={require('../../assets/ratingIcon.png')} style={{ width: 18, height: 18 }} />
              <Text style={{ color: 'white', marginLeft: 5 }}>{movieDetailsData.vote_average} ({movieDetailsData.vote_count})</Text>
            </View>
          </View>

          <View style={styles.descriptionContainer}>
            <Text style={styles.header}>Description</Text>
            <Text style={styles.description}>{movieDetailsData.overview}</Text>
          </View>

          <View style={styles.castInfoContainer}>
            <Text style={styles.header}>Cast</Text>
            <FlatList
              ref={flatListRef}
              horizontal
              contentContainerStyle={{ gap: 10 }}
              data={castDetailsData}
              renderItem={({ item, index }) => {
                return (
                  <CastRenderItem
                    avatarNull={item.profile_path == null}
                    avatarURI={baseImagePath("w300", item.profile_path)}
                    name={item.name}
                    characterName={item.character}
                  />
                )
              }}
            />
          </View>

          <View style={styles.reviewsContainer}>
            <Text style={styles.header}>Reviews</Text>
            <FlatList
              snapToInterval={screenDimensions.screenWidth * 0.9 + 10}
              showsHorizontalScrollIndicator={false}
              horizontal
              bounces
              data={reviewsData}
              style={{
                height: 150
              }}
              contentContainerStyle={{
                gap: 10,
              }}
              decelerationRate={'fast'}
              ref={flatListRef}
              renderItem={({item}) => {
                return(
                  <ReviewCard
                    authorUsername={item.author_details.username}
                    authorAvatar={item.author_details.avatar_path}
                    userRating={item.author_details.rating}
                    review={item.content}
                  />
                )
              }}
            />
          </View>

          <View style={{ height: 110 }} />
        </ScrollView>
        <View style={styles.likeAndDislikeButtonsContainer}>
          <TouchableOpacity onPress={() => handlePressDislike()} style={isMovieDisliked ? [styles.movieIsLikedOrDislikedButton, {backgroundColor: COLOURS.red}] : [styles.likeOrDislikeButton, { borderColor: COLOURS.red }]}>
            <Fontisto name='dislike' size={40} color={isMovieDisliked ? 'black': COLOURS.red} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePressLike()} style={isMovieLiked ? styles.movieIsLikedOrDislikedButton : [styles.likeOrDislikeButton, { borderColor: COLOURS.green }]}>
            <Fontisto name='like' size={40} color={isMovieLiked ? 'black': COLOURS.green} />
          </TouchableOpacity>
        </View>
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

  goBackIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: COLOURS.orange,
    borderRadius: 50,
    position: 'absolute',
    top: StatusBarHeight + 10,
    left: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },

  posterStyle: {
    width: '60%',
    position: 'absolute',
    aspectRatio: 200 / 275,
    bottom: 0,
    alignSelf: 'center'
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
  },

  genreContainer: {
    width: 70,
    height: 30,
    borderWidth: 2,
    borderColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    marginHorizontal: 5
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: "center",
    marginTop: 10
  },

  descriptionContainer: {
    width: '90%',
    alignSelf: 'center',
    marginTop: 10
  },

  header: {
    color: 'white',
    fontSize: 25,
    fontFamily: 'PoppinsBold'
  },

  description: {
    color: 'white',
    fontSize: 15,
    fontFamily: 'Poppins',
    textAlign: 'justify'
  },

  castInfoContainer: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 10,
    height: 195
  },

  reviewsContainer:{
    alignSelf: 'center',
    width: '90%',
    marginTop: 10,
  },

  likeAndDislikeButtonsContainer: {
    height: 100,
    width: '95%',
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0
  },

  likeOrDislikeButton: {
    height: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 5,
    backgroundColor: 'transparent'
  },

  movieIsLikedOrDislikedButton: {
    height: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.green
  }
})