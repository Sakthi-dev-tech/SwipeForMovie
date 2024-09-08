import React, { useContext, useEffect, useState } from "react"
import { ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, Text, View, FlatList } from "react-native"
import Entypo from 'react-native-vector-icons/MaterialIcons'
import { COLOURS } from "../../../theme/theme"
import { screenDimensions } from "../../../constants/screenDimensions"
import { baseImagePath } from "../../../api/MovieAPICall"
import LikeAndDislikeMovieCard from "../../../components/ForProfile/LikeAndDislikeMovieCard"
import { supabase } from "../../../supabase"
import AuthContext from "../../../contexts/AuthContext"
import { useIsFocused } from "@react-navigation/native"

// I need title, poster path, backdrop path, adult, overview and movieID for the movie data

const ProfileScreen = ({ navigation }) => {

  const isFocused = useIsFocused();

  const { user } = useContext(AuthContext)
  const [likedMoviesData, setLikedMoviesData] = useState<any>([])
  const [dislikedMoviesData, setDislikedMoviesData] = useState<any>([])

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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1 }} source={require('../../../assets/background.png')}>
        <TouchableOpacity style={styles.goProfileSettings} onPress={() => navigation.navigate("ProfileAndSettingsScreen")}>
          <Entypo name='settings' color={'white'} size={30} />
        </TouchableOpacity>

        <View style={{ height: screenDimensions.StatusBarHeight }} />

        <Text style={styles.headerTexts}>Liked Movies</Text>

          <FlatList
            style={styles.flatLists}
            bounces={true}
            data={likedMoviesData}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            contentContainerStyle={{ gap: 36 }}
            renderItem={({ item, index }) => <LikeAndDislikeMovieCard
              cardWidth={screenDimensions.screenWidth / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == likedMoviesData?.length - 1 ? true : false}
              title={item.title}
              imagePath={baseImagePath("w185", item.poster_path)}
              cardFunction={() => {
                navigation.navigate('MovieDetails', {
                  fromSearchScreen: false,
                  movieID: item.id,
                  posterPath: baseImagePath("w500", item.poster_path),
                  backdropPath: baseImagePath("w780", item.backdrop_path ? item.backdrop_path : ''),
                  fromProfile: true
                })
              }}
            />}
          />

        <Text style={styles.headerTexts}>Disiked Movies</Text>

        <FlatList
            style={styles.flatLists}
            bounces={true}
            data={dislikedMoviesData}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            contentContainerStyle={{ gap: 36 }}
            renderItem={({ item, index }) => <LikeAndDislikeMovieCard
              cardWidth={screenDimensions.screenWidth / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == dislikedMoviesData?.length - 1 ? true : false}
              title={item.title}
              imagePath={baseImagePath("w185", item.poster_path)}
              cardFunction={() => {
                navigation.navigate('MovieDetails', {
                  fromSearchScreen: false,
                  movieID: item.id,
                  posterPath: baseImagePath("w500", item.poster_path),
                  backdropPath: baseImagePath("w780", item.backdrop_path ? item.backdrop_path : ''),
                  fromProfile: true
                })
              }}
            />}
          />
      </ImageBackground>
    </SafeAreaView>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  goProfileSettings: {
    width: 40,
    height: 40,
    backgroundColor: COLOURS.orange,
    borderRadius: 50,
    position: 'absolute',
    top: screenDimensions.StatusBarHeight + 10,
    right: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1
  },

  headerTexts: {
    color: 'white',
    fontFamily: "PoppinsBold",
    fontSize: 25,
    marginTop: 50,
    marginLeft: 10
  },

  flatLists: {
    marginVertical: 10,
    maxHeight: screenDimensions.screenWidth / 1.90
  },
})