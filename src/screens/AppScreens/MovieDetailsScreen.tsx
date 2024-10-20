import { ActivityIndicator, FlatList, Image, ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import GoogleIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { LinearGradient } from 'expo-linear-gradient'
import { baseImagePath, movieCastDetails, movieDetails, movieReviews, movieVideo } from '../../api/MovieAPICall'
import { COLOURS } from '../../theme/theme'
import Entypo from 'react-native-vector-icons/Entypo'
import Fontisto from 'react-native-vector-icons/Fontisto'
import { useIsFocused } from '@react-navigation/native'
import { screenDimensions } from '../../constants/screenDimensions'
import CastRenderItem from '../../components/ForMovieDetailsScreen/CastRenderItem'
import ReviewCard from '../../components/ForMovieDetailsScreen/ReviewCard'
import { supabase } from '../../Embeddings/supabase'
import AuthContext from '../../contexts/AuthContext'
import YoutubeIframe from 'react-native-youtube-iframe'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const StatusBarHeight = screenDimensions.StatusBarHeight || 0

const MovieDetailsScreen = ({ navigation, route }) => {

  const { user } = useContext(AuthContext)

  const { fromSearchScreen, movieID, backdropPath, posterPath, fromProfile } = route.params

  const isFocused = useIsFocused()

  const [movieDetailsData, setMovieDetailsData] = useState<any>(undefined)
  const [castDetailsData, setCastDetailsData] = useState<any>(undefined)
  const [reviewsData, setReviewsData] = useState<any>(undefined)
  const [reviewPageNum, setReviewPageNum] = useState<number>(1)
  const [totalNumberOfReviewPages, setTotalNumberOfReviewPages] = useState<number>(0)
  const [fetchAnotherPageOfReview, setFetchAnotherPageOfReview] = useState<boolean>(true)
  const [videoID, setVideoID] = useState<string>("")

  const scrollViewRef = useRef<ScrollView>(null)
  const flatListRef = useRef<FlatList<any>>(null);
  const [itemHeights, setItemHeights] = useState({});

  const [isMovieLiked, setIsMovieLiked] = useState<boolean>(false)
  const [isMovieDisliked, setIsMovieDisliked] = useState<boolean>(false)

  const [listOfAllLikedMovies, setListOfAllLikedMovies] = useState<any>([])
  const [listOfAllDislikedMovies, setListOfAllDislikedMovies] = useState<any>([])
  const [currentMovieForDB, setCurrentMovieForDB] = useState<any>(undefined)

  const [movieDeetsFetched, setMovieDeetsFetched] = useState<boolean>(false)
  const [fetchedLikedAndDislikedMovies, setFetchedLikedAndDislikedMovies] = useState<boolean>(false)
  const [videoIDFetched, setVideoIDFetched] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    if (movieDeetsFetched && fetchedLikedAndDislikedMovies && videoIDFetched) {
      setIsLoading(false)
    }

    // if page not focused
    if (!isFocused) {
      setIsLoading(true)
      setMovieDeetsFetched(false)
      setFetchedLikedAndDislikedMovies(false)
      setVideoIDFetched(false)
      setReviewPageNum(1)
    }
  }, [isFocused, movieDeetsFetched, fetchedLikedAndDislikedMovies, videoIDFetched])

  // fetch liked and disliked movies
  useEffect(() => {
    const fetchLikedMoviesList = async () => {
      const { data: likedMoviesFromDB, error: likedMoviesFromDBError } = await supabase
        .from("UsersMovieData")
        .select("liked_movies")
        .eq("userID", user.uid)

      if (likedMoviesFromDB) {
        setListOfAllLikedMovies(likedMoviesFromDB[0].liked_movies)
        setIsMovieLiked(likedMoviesFromDB[0].liked_movies.some(item => item.id === movieID))
      }

      if (likedMoviesFromDBError) {
        console.error("Error while fetching liked movies: ", likedMoviesFromDBError)
      }


    }

    const fetchDislikedMoviesList = async () => {
      const { data: dislikedMoviesFromDB, error: dislikedMoviesFromDBError } = await supabase
        .from("UsersMovieData")
        .select("disliked_movies")
        .eq("userID", user.uid)

      if (dislikedMoviesFromDB) {
        setListOfAllDislikedMovies(dislikedMoviesFromDB[0].disliked_movies)
        setIsMovieDisliked(dislikedMoviesFromDB[0].disliked_movies.some(item => item.id === movieID))
      }

      if (dislikedMoviesFromDBError) {
        console.error("Error while fetching disliked movies: ", dislikedMoviesFromDBError)
      }
    }

    fetchLikedMoviesList();
    fetchDislikedMoviesList();

    setFetchedLikedAndDislikedMovies(true)
  }, [isFocused, movieID])

  useEffect(() => {
    // to make sure your cast flatlist starts from index 0 for the flatlist to have time to initialise all items
    flatListRef.current?.scrollToOffset({ offset: 0, animated: false })

    const fetchMovieDetails = async () => {
      try {
        let response = await fetch(movieDetails(movieID))
        let movieDeets = await response.json()
        setMovieDetailsData(movieDeets)

        setCurrentMovieForDB({
          id: movieID,
          adult: movieDeets?.adult,
          title: movieDeets?.title,
          overview: movieDeets?.overview,
          poster_path: posterPath,
          backdrop_path: backdropPath,
          original_language: movieDeets?.original_language
        })
      } catch (err) {
        console.error("Something went wrong while fetching the movie details: ", err)
      } finally {
        setMovieDeetsFetched(true)
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
        let response = await fetch(movieReviews(movieID, reviewPageNum))
        let reviewDeets = await response.json()
        setReviewsData(reviewDeets.results)
        setTotalNumberOfReviewPages(reviewDeets.total_pages)
      } catch (err) {
        console.error("Something went wrong while fetching the review details: ", err)
      } finally {
        setFetchAnotherPageOfReview(false)
      }
    }

    const fetchMovieVideo = async () => {
      try {
        let response = await fetch(movieVideo(movieID))
        let video = await response.json()
        video.results.map((item, index) => {
          if (item.site === "YouTube" && item.type === "Trailer" && item.official === true) {
            setVideoID(item.key)
          } else if (item.site === "YouTube" && item.type === "Teaser" && item.official === true) {
            setVideoID(item.key)
          }
        })
      } catch (err) {
        console.error("Something went wrong while fetching the trailer video: ", err)
      } finally {
        setVideoIDFetched(true)
      }
    }

    if (isFocused){
      fetchMovieDetails();
      fetchMovieCastDetails();
      fetchReviews();
      fetchMovieVideo();
    }
  }, [isFocused])

  // fetch new page of reviews when requested
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        let response = await fetch(movieReviews(movieID, reviewPageNum))
        let reviewDeets = await response.json()
        setReviewsData(reviewDeets.results)
        setTotalNumberOfReviewPages(reviewDeets.total_pages)
      } catch (err) {
        console.error("Something went wrong while fetching the review details: ", err)
      } finally {
        setFetchAnotherPageOfReview(false)
      }
    }

    if (fetchAnotherPageOfReview) {
      fetchReviews();
    }
  }, [fetchAnotherPageOfReview])

  useEffect(() => {
    const updateTheLikedAndDislikedMoviesInDB = async () => {
      const { data, error } = await supabase
        .from('UsersMovieData')
        .update({
          liked_movies: listOfAllLikedMovies,
          disliked_movies: listOfAllDislikedMovies
        })
        .eq("userID", user.uid)
    }

    if (!isFocused) {
      updateTheLikedAndDislikedMoviesInDB();
    }

  }, [isFocused])

  const handleGoBack = async () => {
    if (fromSearchScreen) {
      navigation.navigate("SearchScreen")
    } else if (fromProfile) {
      navigation.navigate("Profile")
    } else {
      navigation.navigate("Home")
    }
    scrollViewRef?.current?.scrollTo({ y: 0, animated: false })
  }

  function handlePressDislike() {

    if (isMovieDisliked) {
      // if already disliked, just undislike it
      setListOfAllDislikedMovies(list => list.filter(item => item.id !== movieID))
      setIsMovieDisliked(false)
    } else {
      setListOfAllDislikedMovies(prevMovies => [...prevMovies, currentMovieForDB])
      setIsMovieDisliked(true)
    }
    if (isMovieLiked) {
      // if movie was liked before
      setListOfAllLikedMovies(list => list.filter(item => item.id !== movieID))
      setIsMovieLiked(false)
    }
  }

  function handlePressLike() {

    if (isMovieLiked) {
      // if already liked, just unlike it
      setListOfAllLikedMovies(list => list.filter(item => item.id !== movieID))
      setIsMovieLiked(false)
    } else {
      setListOfAllLikedMovies(prevMovies => [...prevMovies, currentMovieForDB])
      setIsMovieLiked(true)
    }

    if (isMovieDisliked) {
      setListOfAllDislikedMovies(list => list.filter(item => item.id !== movieID))
      setIsMovieDisliked(false)
    }
  }

  if (isLoading) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: 'black' }} size={'large'} color={COLOURS.orange} />
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require("../../assets/background.png")}>

        <TouchableOpacity style={styles.goBackIconContainer} onPress={() => {
          handleGoBack()
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
              <Image source={require('../../assets/icons/ratingIcon.png')} style={{ width: 18, height: 18 }} />
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

          {
            videoID ? (
              <View style={styles.trailerContainer}>
                <Text style={styles.header}>Movie Trailer</Text>
                <YoutubeIframe
                  height={200}
                  videoId={videoID}
                  width={screenDimensions.screenWidth * 0.9}
                />
              </View>

            ) : (
              <View />
            )
          }

          <View style={styles.reviewsContainer}>
            <Text style={styles.header}>Reviews</Text>
            {
              reviewsData && reviewsData.length > 0 ? (
                <View>
                  <FlatList
                    snapToInterval={screenDimensions.screenWidth * 0.9 + 10}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={reviewsData}
                    style={{
                      height: 'auto'
                    }}
                    contentContainerStyle={{
                      gap: 10,
                      height: 'auto'
                    }}
                    decelerationRate={'fast'}
                    ref={flatListRef}
                    extraData={itemHeights}
                    renderItem={({ item, index }) => {
                      return (
                        <View onLayout={(event) => {
                          const { height } = event.nativeEvent.layout;
                          setItemHeights(prevHeights => ({ ...prevHeights, [index]: height }));
                        }}>
                          <ReviewCard
                            authorUsername={item.author_details.username}
                            authorAvatar={item.author_details.avatar_path}
                            userRating={item.author_details.rating}
                            review={item.content}
                          />
                        </View>
                      )
                    }}
                  />

                  <View style={styles.reviewNavigatorControlContainer}>
                    <MaterialCommunityIcons name='chevron-left' color={reviewPageNum === 1 ? 'gray' : COLOURS.orange} size={20} onPress={() => {
                      if (fetchAnotherPageOfReview === false && reviewPageNum > 1) {
                        setReviewPageNum(reviewPageNum - 1)
                        flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
                        setFetchAnotherPageOfReview(true)
                      }
                      }}/>
                    <Text style={{color: COLOURS.orange, fontSize: 20}}>{reviewPageNum}</Text>
                    <MaterialCommunityIcons name='chevron-right' color={reviewPageNum === totalNumberOfReviewPages ? 'gray' : COLOURS.orange} size={20} onPress={() => {
                      if (fetchAnotherPageOfReview === false && reviewPageNum < totalNumberOfReviewPages){
                        setReviewPageNum(reviewPageNum + 1)
                        flatListRef.current?.scrollToOffset({ offset: 0, animated: false })
                        setFetchAnotherPageOfReview(true)
                      }
                      }}/>
                  </View>
                </View>
              ) : (
                <Text style={{ color: 'white', fontSize: 20, alignSelf: 'center', fontFamily: 'Lato', marginTop: 20 }}>Oops! No Reviews Yet!</Text>
              )
            }
          </View>

          <View style={{ height: 125 }} />
        </ScrollView>
        <View style={styles.likeAndDislikeButtonsContainer}>
          <TouchableOpacity onPress={() => handlePressDislike()} style={isMovieDisliked ? [styles.movieIsLikedOrDislikedButton, { backgroundColor: COLOURS.red }] : [styles.likeOrDislikeButton, { borderColor: COLOURS.red }]}>
            <Fontisto name='dislike' size={40} color={isMovieDisliked ? 'black' : COLOURS.red} />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlePressLike()} style={isMovieLiked ? styles.movieIsLikedOrDislikedButton : [styles.likeOrDislikeButton, { borderColor: COLOURS.green }]}>
            <Fontisto name='like' size={40} color={isMovieLiked ? 'black' : COLOURS.green} />
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

  reviewsContainer: {
    alignSelf: 'center',
    width: '90%',
    marginTop: 30,
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
    backgroundColor: 'black'
  },

  movieIsLikedOrDislikedButton: {
    height: '80%',
    aspectRatio: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOURS.green
  },

  trailerContainer: {
    width: '90%',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10
  },

  reviewNavigatorControlContainer: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 100,
    flexDirection: 'row'
  }
})