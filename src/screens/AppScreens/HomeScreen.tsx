import { Text, Animated, SafeAreaView, ImageBackground, TextInput, StyleSheet, ActivityIndicator, FlatList, View, Modal, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'

import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { COLOURS } from '../../theme/theme'
import { baseImagePath, movieDetails, nowPlayingMovies, popularMovies, upcomingMovies } from '../../api/MovieAPICall'
import PopularAndUpcomingMovieCard from '../../components/ForHomepage/PopularAndUpcomingMovieCard'
import { screenDimensions } from '../../constants/screenDimensions'
import NowPlayingMovieCard from '../../components/ForHomepage/NowPlayingMovieCard'
import SettingsContext from '../../contexts/SettingsContext'

const HomeScreen = ({ navigation }) => {

    const { showAdultFilms } = useContext(SettingsContext)

    const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState<any>(undefined)
    const [popularMoviesList, setPopularMoviesList] = useState<any>(undefined)
    const [upcomingMoviesList, setUpcomingMoviesList] = useState<any>(undefined)
    const [searchQuery, setSearchQuery] = useState<string>('')

    const getNowPlayingMoviesList = async () => {

        try {
            let response = await fetch(`${nowPlayingMovies}&include_adult=${showAdultFilms}`)
            let json = await response.json();
            return json
        } catch (err) {
            console.warn("Error while fetching now playing movies: ", err)
        }
    }
    const getPopularMoviesList = async () => {
        try {
            let response = await fetch(`${popularMovies}&include_adult=${showAdultFilms}`)
            let json = await response.json();
            return json
        } catch (err) {
            console.warn("Error while fetching popular movies: ", err)
        }
    }
    const getUpcomingMoviesList = async () => {
        try {
            let response = await fetch(`${upcomingMovies}&include_adult=${showAdultFilms}`)
            let json = await response.json();
            return json
        } catch (err) {
            console.warn("Error while upcoming movies: ", err)
        }
    }

    useEffect(() => {
        const fetchMovies = async () => {

            let tempNowPlaying = await getNowPlayingMoviesList();
            setNowPlayingMoviesList([{ id: 'dummy1' }, ...tempNowPlaying.results, { id: 'dummy2' }]);

            let tempPopularMovies = await getPopularMoviesList();
            setPopularMoviesList({ ...tempPopularMovies }.results);

            let tempUpcomingMovies = await getUpcomingMoviesList();
            setUpcomingMoviesList({ ...tempUpcomingMovies }.results);
        }

        fetchMovies()
    }, [])

    function handleSearch() {
        navigation.navigate("SearchScreen")
    }

    const scrollY = useRef(new Animated.Value(0)).current

    if (
        nowPlayingMoviesList == undefined &&
        nowPlayingMoviesList == null &&
        popularMoviesList == undefined &&
        popularMoviesList == null &&
        upcomingMoviesList == undefined &&
        upcomingMoviesList == null
    ) {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <ImageBackground style={{ flex: 1 }} source={require('../../assets/background.png')}>
                    <ActivityIndicator style={{ flex: 1, backgroundColor: 'transparent' }} size={'large'} color={COLOURS.orange} />
                </ImageBackground>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={require('../../assets/background.png')}>
                <View style={{ flex: 1, marginTop: screenDimensions.StatusBarHeight + 10, backgroundColor: 'black'}}>
                    <Animated.View style={[styles.searchMovieContainer, {
                        opacity: scrollY.interpolate({
                            inputRange: [0, 250],
                            outputRange: [1, 0]
                        }),
                        transform: [{
                            scale: scrollY.interpolate({
                                inputRange: [0, 250],
                                outputRange: [1, 0]
                            })
                        }]
                    }]}>
                        <TouchableOpacity onPress={() => handleSearch()}>
                            <EvilIcons name='search' size={40} color={COLOURS.orange} style={{ marginBottom: 5, marginHorizontal: 10 }} />
                        </TouchableOpacity>
                    </Animated.View>

                    <Animated.ScrollView
                        bounces={false}
                        style={{ flex: 1, paddingTop: 40 }}
                        onScroll={
                            Animated.event(
                                [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                                { useNativeDriver: true }
                            )
                        }
                        scrollEventThrottle={16}
                    >
                        <Text style={styles.headerText}>Now Playing</Text>
                        <FlatList
                            snapToInterval={screenDimensions.screenWidth * 0.7 + 36}
                            decelerationRate={'fast'}
                            style={styles.flatLists}
                            bounces={true}
                            data={nowPlayingMoviesList}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            contentContainerStyle={{ gap: 36 }}
                            renderItem={({ item, index }) => {
                                if (!item.original_title) {
                                    return <View style={{ width: ((screenDimensions.screenWidth * 0.3) - 72) / 2 }} />
                                }
                                return (
                                    <NowPlayingMovieCard
                                        cardWidth={screenDimensions.screenWidth * 0.7}
                                        isFirst={index == 0 ? true : false}
                                        isLast={index == nowPlayingMoviesList?.length - 1 ? true : false}
                                        title={item.original_title}
                                        imagePath={baseImagePath("w400", item.poster_path)}
                                        cardFunction={() => {
                                            navigation.navigate('MovieDetails', {
                                                fromSearchScreen: false,
                                                movieID: item.id,
                                                backdropPath: baseImagePath("w780", item.backdrop_path),
                                                posterPath: baseImagePath("w500", item.poster_path)
                                            })
                                        }}
                                        genreIDs={item.genre_ids.slice(0, 3)}
                                        vote_average={item.vote_average}
                                        vote_count={item.vote_count}
                                    />
                                )
                            }}
                        />

                        <Text style={styles.headerText}>Popular</Text>
                        <FlatList
                            style={styles.flatLists}
                            bounces={true}
                            data={popularMoviesList}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            contentContainerStyle={{ gap: 36 }}
                            renderItem={({ item, index }) => <PopularAndUpcomingMovieCard
                                cardWidth={screenDimensions.screenWidth / 3}
                                isFirst={index == 0 ? true : false}
                                isLast={index == popularMoviesList?.length - 1 ? true : false}
                                title={item.original_title}
                                imagePath={baseImagePath("w185", item.poster_path)}
                                cardFunction={() => {
                                    navigation.navigate('MovieDetails', {
                                        fromSearchScreen: false,
                                        movieID: item.id,
                                        backdropPath: baseImagePath("w780", item.backdrop_path),
                                        posterPath: baseImagePath("w500", item.poster_path)
                                    })
                                }}
                            />}
                        />

                        <Text style={styles.headerText}>Upcoming</Text>
                        <FlatList
                            style={styles.flatLists}
                            bounces={true}
                            data={upcomingMoviesList}
                            keyExtractor={(item) => item.id.toString()}
                            horizontal
                            contentContainerStyle={{ gap: 36 }}
                            renderItem={({ item, index }) => <PopularAndUpcomingMovieCard
                                cardWidth={screenDimensions.screenWidth / 3}
                                isFirst={index == 0 ? true : false}
                                isLast={index == upcomingMoviesList?.length - 1 ? true : false}
                                title={item.original_title}
                                imagePath={baseImagePath("w185", item.poster_path)}
                                cardFunction={() => {
                                    navigation.navigate('MovieDetails', { 
                                        movieID: item.id,
                                        fromSearchScreen: false,
                                        backdropPath: baseImagePath("w780", item.backdrop_path),
                                        posterPath: baseImagePath("w500", item.poster_path)
                                    })
                                }}
                            />}
                        />
                        <View
                            style={{ height: 140 }}
                        />
                    </Animated.ScrollView>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    searchMovieContainer: {
        flexDirection: 'row',
        width: '90%',
        height: 50,
        borderRadius: 20,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'absolute',
        top: 0,
        overflow: 'hidden',
        zIndex: 1
    },

    headerText: {
        marginTop: 20,
        marginHorizontal: 10,
        color: COLOURS.orange,
        fontFamily: "PlayFair",
        fontSize: 30,
        fontWeight: 'bold'
    },

    flatLists: {
        marginVertical: 10
    },
})