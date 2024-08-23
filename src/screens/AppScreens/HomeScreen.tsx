import { Text, Animated, SafeAreaView, ImageBackground, TextInput, StyleSheet, ActivityIndicator, FlatList, Dimensions, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'

import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { COLOURS } from '../../theme/theme'
import { baseImagePath, movieDetails, nowPlayingMovies, popularMovies, upcomingMovies } from '../../api/MovieAPICall'
import PopularAndUpcomingMovieCard from '../../components/ForHomepage/PopularAndUpcomingMovieCard'
import { screenDimensions } from '../../constants/screenDimensions'
import NowPlayingMovieCard from '../../components/ForHomepage/NowPlayingMovieCard'

const getNowPlayingMoviesList = async () => {
    try {
        let response = await fetch(nowPlayingMovies)
        let json = await response.json();
        return json
    } catch (err) {
        console.warn("Error while fetching now playing movies: ", err)
    }
}
const getPopularMoviesList = async () => {
    try {
        let response = await fetch(popularMovies)
        let json = await response.json();
        return json
    } catch (err) {
        console.warn("Error while fetching popular movies: ", err)
    }
}
const getUpcomingMoviesList = async () => {
    try {
        let response = await fetch(upcomingMovies)
        let json = await response.json();
        return json
    } catch (err) {
        console.warn("Error while upcoming movies: ", err)
    }
}

const HomeScreen = ({ navigation }) => {

    const [nowPlayingMoviesList, setNowPlayingMoviesList] = useState(undefined)
    const [popularMoviesList, setPopularMoviesList] = useState(undefined)
    const [upcomingMoviesList, setUpcomingMoviesList] = useState(undefined)

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
                <Animated.View style={[styles.searchMovieContainer, {
                    opacity: scrollY.interpolate({
                        inputRange: [-1, 250],
                        outputRange: [1, 0]
                    }),
                    transform: [{
                        scale: scrollY.interpolate({
                            inputRange: [-1, 250],
                            outputRange: [1, 0]
                        })
                    }]
                }]}>
                    <EvilIcons name='search' size={25} color={COLOURS.orange} style={{ marginBottom: 5, marginHorizontal: 10 }} />
                    <TextInput
                        placeholder='Search your Movies...'
                        placeholderTextColor={'gray'}
                    />
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
                            if(!item.original_title){
                                return <View style={{ width: ((screenDimensions.screenWidth * 0.3) - 72) / 2}} />
                            }
                            return(                                
                                <NowPlayingMovieCard
                                    cardWidth={screenDimensions.screenWidth * 0.7}
                                    isFirst={index == 0 ? true : false}
                                    isLast={index == nowPlayingMoviesList?.length - 1 ? true : false}
                                    title={item.original_title}
                                    imagePath={baseImagePath("w400", item.poster_path)}
                                    cardFunction={() => {
                                        navigation.navigate('MovieDetails', { 
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
                                navigation.navigate('MovieDetails', { movieID: item.id })
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
                                navigation.navigate('MovieDetails', { movieID: item.id })
                            }}
                        />}
                    />
                    <View 
                        style={{height: 140}}
                    />
                </Animated.ScrollView>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    searchMovieContainer: {
        flexDirection: 'row',
        width: '80%',
        height: 40,
        borderRadius: 20,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        borderWidth: 1,
        borderColor: COLOURS.orange,
        alignItems: 'center',
        position: 'absolute',
        top: 0
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
    }

})