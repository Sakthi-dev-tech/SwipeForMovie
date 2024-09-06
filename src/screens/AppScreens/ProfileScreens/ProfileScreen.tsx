import React from "react"
import { ImageBackground, SafeAreaView, StyleSheet, TouchableOpacity, Text, View, FlatList } from "react-native"
import Entypo from 'react-native-vector-icons/MaterialIcons'
import { COLOURS } from "../../../theme/theme"
import { screenDimensions } from "../../../constants/screenDimensions"
import { baseImagePath } from "../../../api/MovieAPICall"
import LikeAndDislikeMovieCard from "../../../components/ForProfile/LikeAndDislikeMovieCard"

const sampleMovies = [
  {
    "adult": false,
    "backdrop_path": null,
    "genre_ids": [],
    "id": 975419,
    "original_language": "en",
    "original_title": "Marvel",
    "overview": "The quintessential student film of 1969.",
    "popularity": 2.138,
    "poster_path": "/p6XFjLX7XDnAMCczOBCevVaZpFv.jpg",
    "release_date": "1969-05-20",
    "title": "Marvel",
    "video": false,
    "vote_average": 6.5,
    "vote_count": 27
  },
  {
    "adult": false,
    "backdrop_path": "/criPrxkTggCra1jch49jsiSeXo1.jpg",
    "genre_ids": [
      878,
      12,
      28
    ],
    "id": 609681,
    "original_language": "en",
    "original_title": "The Marvels",
    "overview": "Carol Danvers, aka Captain Marvel, has reclaimed her identity from the tyrannical Kree and taken revenge on the Supreme Intelligence. But unintended consequences see Carol shouldering the burden of a destabilized universe. When her duties send her to an anomalous wormhole linked to a Kree revolutionary, her powers become entangled with that of Jersey City super-fan Kamala Khan, aka Ms. Marvel, and Carol’s estranged niece, now S.A.B.E.R. astronaut Captain Monica Rambeau. Together, this unlikely trio must team up and learn to work in concert to save the universe.",
    "popularity": 232.461,
    "poster_path": "/9GBhzXMFjgcZ3FdR9w3bUMMTps5.jpg",
    "release_date": "2023-11-08",
    "title": "The Marvels",
    "video": false,
    "vote_average": 6.085,
    "vote_count": 2555
  },
  {
    "adult": false,
    "backdrop_path": "/bQl46uhGPTu9jnIRE9Ip2xOMc9M.jpg",
    "genre_ids": [
      10751,
      12,
      16,
      14,
      878
    ],
    "id": 382190,
    "original_language": "ja",
    "original_title": "ポケモン・ザ・ムービーXY&Z ボルケニオンと機巧のマギアナ",
    "overview": "Ash meets the Mythical Pokémon Volcanion when it crashes down from the sky, creating a cloud of dust—and a mysterious force binds the two of them together! Volcanion despises humans and tries to get away, but it’s forced to drag Ash along as it continues its rescue mission. They arrive in a city of cogs and gears, where a corrupt official has stolen the ultimate invention: the Artificial Pokémon Magearna, created 500 years ago. He plans to use its mysterious power to take control of this mechanical kingdom! Can Ash and Volcanion work together to rescue Magearna? One of the greatest battles in Pokémon history is about to unfold!",
    "popularity": 28.504,
    "poster_path": "/j9TIzeMxNknVrBvgxzLqhIhxml4.jpg",
    "release_date": "2016-07-16",
    "title": "Pokémon the Movie: Volcanion and the Mechanical Marvel",
    "video": false,
    "vote_average": 6.714,
    "vote_count": 173
  },
  {
    "adult": false,
    "backdrop_path": "/qAzYK4YPSWDc7aa4R43LcwRIAyb.jpg",
    "genre_ids": [
      28,
      12,
      878
    ],
    "id": 299537,
    "original_language": "en",
    "original_title": "Captain Marvel",
    "overview": "The story follows Carol Danvers as she becomes one of the universe’s most powerful heroes when Earth is caught in the middle of a galactic war between two alien races. Set in the 1990s, Captain Marvel is an all-new adventure from a previously unseen period in the history of the Marvel Cinematic Universe.",
    "popularity": 72.894,
    "poster_path": "/AtsgWhDnHTq68L0lLsUrCnM7TjG.jpg",
    "release_date": "2019-03-06",
    "title": "Captain Marvel",
    "video": false,
    "vote_average": 6.8,
    "vote_count": 15491
  },
]

const ProfileScreen = ({ navigation }) => {
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
            data={sampleMovies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            contentContainerStyle={{ gap: 36 }}
            renderItem={({ item, index }) => <LikeAndDislikeMovieCard
              cardWidth={screenDimensions.screenWidth / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == sampleMovies?.length - 1 ? true : false}
              title={item.original_title}
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
            data={sampleMovies}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            contentContainerStyle={{ gap: 36 }}
            renderItem={({ item, index }) => <LikeAndDislikeMovieCard
              cardWidth={screenDimensions.screenWidth / 3}
              isFirst={index == 0 ? true : false}
              isLast={index == sampleMovies?.length - 1 ? true : false}
              title={item.original_title}
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