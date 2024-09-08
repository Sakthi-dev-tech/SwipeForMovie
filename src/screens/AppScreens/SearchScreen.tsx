import { Animated, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useRef, useState } from 'react'
import { ImageBackground } from 'react-native'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import { COLOURS } from '../../theme/theme'
import { screenDimensions } from '../../constants/screenDimensions'
import { useIsFocused } from '@react-navigation/native'
import { baseImagePath, searchMovies } from '../../api/MovieAPICall'
import SearchCard from '../../components/ForHomepage/ForSearchScreen/SearchCard'
import SettingsContext from '../../contexts/SettingsContext'

const SearchScreen = ({navigation}) => {

    const { showAdultFilms } = useContext(SettingsContext)

    const searchBarBorderWidth = useRef(new Animated.Value(0)).current
    const searchIconTranslateX = useRef(new Animated.Value(0)).current
    const placeholderText = 'Search your Movies...'

    const [placeholder, setPlaceholder] = useState('')
    const placeholderIndex = useRef(new Animated.Value(0)).current

    const [query, setQuery] = useState<string>('')
    const [results, setResults] = useState<any>()
    const flatListRef = useRef<FlatList<any>>(null);

    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            Animated.timing(searchBarBorderWidth, {
                toValue: 1,
                duration: 500,
                useNativeDriver: false
            }).start()

            Animated.timing(searchIconTranslateX, {
                toValue: screenDimensions.screenWidth * 0.9 - 50,
                duration: 500,
                useNativeDriver: true
            }).start()

            Animated.timing(placeholderIndex, {
                toValue: placeholderText.length,
                duration: 500,
                useNativeDriver: false
            }).start()

        }

        if (!isFocused) {
            if (query.length === 0){
                searchBarBorderWidth.setValue(0)
                searchIconTranslateX.setValue(0)
                placeholderIndex.setValue(0)
            }
        }
    }, [isFocused])

    useEffect(() => {
        // Listen to changes in the animated value
        const listenerId = placeholderIndex.addListener(({ value }) => {
          setPlaceholder(placeholderText.slice(0, Math.round(value)));
        });
    
        // Cleanup listener on unmount
        return () => {
          placeholderIndex.removeListener(listenerId);
        };
      }, [placeholderIndex]);

      async function handleSearch(text) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        setQuery(text)
        const results = await fetch(`${searchMovies(text)}&include_adult=${showAdultFilms}`)
        await results.json().then((response) => {
            setResults(response.results)
        })
      }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={require('../../assets/background.png')}>
                <View style={{ flex: 1, marginTop: screenDimensions.StatusBarHeight + 10, backgroundColor: 'black' }}>
                    <Animated.View style={[styles.searchMovieContainer, { borderWidth: searchBarBorderWidth }]}>
                        <Animated.View style={[styles.searchIcon, { transform: [{ translateX: searchIconTranslateX }] }]}>
                            <EvilIcons name='search' size={40} color={COLOURS.orange} />
                        </Animated.View>
                            <TextInput
                                style={styles.textInput}
                                cursorColor={COLOURS.orange}
                                placeholder={placeholder}
                                placeholderTextColor={COLOURS.secondary}
                                value={query}
                                onChangeText={text => handleSearch(text)}
                            />
                    </Animated.View>

                    <View style={styles.searchResultsContainer}>
                        <FlatList
                            ref={flatListRef}
                            data={results}
                            numColumns={2}
                            keyExtractor={(item) => item.id}
                            contentContainerStyle={{
                                rowGap: 10,
                                columnGap: 10
                            }}
                            style={{
                                flex: 1,
                                alignSelf: 'center',
                                width: '95%',
                            }}
                            renderItem={({item}) => {
                                return (
                                    <SearchCard 
                                        title={item.original_title}
                                        posterPath={item.poster_path}
                                        touchFunction={() => {
                                            navigation.navigate("MovieDetails", {
                                                fromSearchScreen: true,
                                                movieID: item.id,
                                                backdropPath: baseImagePath("w780", item.backdrop_path),
                                                posterPath: baseImagePath("w500", item.poster_path)
                                            })
                                        }}
                                    />
                                )
                            }}
                        />
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
    )

}

export default SearchScreen

const styles = StyleSheet.create({
    searchMovieContainer: {
        flexDirection: 'row',
        width: screenDimensions.screenWidth * 0.9,
        height: 50,
        borderRadius: 20,
        backgroundColor: 'transparent',
        alignSelf: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderColor: COLOURS.orange
    },

    searchIcon: {
        bottom: 13,
        left: 5,
        position: 'absolute'
    },

    textInput:{
        marginLeft: 5,
        color: 'white',
        width: 'auto',
        flex: 1,
        fontSize: 18,
        fontFamily: 'Poppins'
    },

    searchResultsContainer: {
        marginTop: 10,
        flex: 1
    }
})