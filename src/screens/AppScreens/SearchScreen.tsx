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
import SearchUsers from '../../components/ForHomepage/ForSearchScreen/SearchUsers'
import { collection, doc, endAt, getDoc, getDocs, orderBy, query, startAt } from 'firebase/firestore'
import { FIRESTORE } from '../../../firebase.config'
import AuthContext from '../../contexts/AuthContext'
import UserProfileModal from '../../components/ForHomepage/ForSearchScreen/UserProfileModal'

const SearchScreen = ({ navigation }) => {

    const { showAdultFilms } = useContext(SettingsContext)
    const { user } = useContext(AuthContext)

    const searchBarBorderWidth = useRef(new Animated.Value(0)).current
    const searchIconTranslateX = useRef(new Animated.Value(0)).current
    const placeholderText = 'Search for Users or Movies...'

    const [placeholder, setPlaceholder] = useState('')
    const placeholderIndex = useRef(new Animated.Value(0)).current

    const [searchQuery, setQuery] = useState<string>('')
    const [results, setResults] = useState<any>()
    const usersList = new Map()
    const [usersListArray, setUsersListArray] = useState<any>();
    const flatListRef = useRef<FlatList<any>>(null);

    const [showUserProfileModal, setShowUserProfileModal] = useState<boolean>(false);
    const [userFollowingList, setUserFollowingList] = useState<string[]>()
    const [selectedUserUsername, setSelectedUserUsername] = useState<string>('');
    const [selectedUserUID, setSelectedUserUID] = useState<string>('');

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
            if (searchQuery.length === 0) {
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

    useEffect(() => {
        const getUserFollowing = async () => {
            await getDoc(doc(FIRESTORE, 'userFollowing', user.uid)).then((snapshot) => {
                if (snapshot.exists()) {
                    setUserFollowingList(snapshot.get('following'))
                }
            })
        }

        getUserFollowing();
    }, [])

    async function handleSearch(text) {
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true })
        setQuery(text)

        // get the movies searched up
        const results = await fetch(`${searchMovies(text)}&include_adult=${showAdultFilms}`)
        await results.json().then((response) => {
            setResults(response.results)
        })

        // get the users to display also
        if (searchQuery.length > 0) {
            const q = query(collection(FIRESTORE, 'userInfo'),
                orderBy('username'),
                startAt(searchQuery),
                endAt(searchQuery + '\uf8ff')
            )
            setUsersListArray(null)
            const querySnapshot = await getDocs(q);
            const filteredDocuments = querySnapshot.docs.filter(doc => doc.id !== user?.uid);
            filteredDocuments.forEach((doc) => {
                usersList.set(doc.id, doc.get('username'))
            })
            setUsersListArray(Array.from(usersList))
        } else {
            setUsersListArray({})
        }

    }

    function handleUserPressed(item) {
        const userUID = item[0]
        const username = item[1]

        setSelectedUserUsername(username)
        setSelectedUserUID(userUID)
        setShowUserProfileModal(true)
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1 }} source={require('../../assets/background.png')}>
                <View style={{ flex: 1, marginTop: screenDimensions.StatusBarHeight + 10, backgroundColor: 'transparent' }}>
                    <Animated.View style={[styles.searchMovieContainer, { borderWidth: searchBarBorderWidth }]}>
                        <Animated.View style={[styles.searchIcon, { transform: [{ translateX: searchIconTranslateX }] }]}>
                            <EvilIcons name='search' size={40} color={COLOURS.orange} />
                        </Animated.View>
                        <TextInput
                            style={styles.textInput}
                            cursorColor={COLOURS.orange}
                            placeholder={placeholder}
                            placeholderTextColor={COLOURS.secondary}
                            value={searchQuery}
                            onChangeText={text => handleSearch(text)}
                        />
                    </Animated.View>

                    {/* TODO WHEN THE SEARCH QUERY IS EMPTY, THE PREVIOUSLY SEARCHED USERS DO NOT DISAPPEAR */}

                    <Text style={styles.headerText}>Users</Text>
                    <FlatList
                        data={usersListArray}
                        style={{
                            maxHeight: 125,
                        }}
                        contentContainerStyle={{
                            alignItems: 'center'
                        }}
                        horizontal
                        keyExtractor={(_, index) => index.toString()} // Ensure a unique key
                        renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => handleUserPressed(item)}>
                                    <SearchUsers
                                        username={item[1]}
                                        userID={item[0]}
                                    />
                                </TouchableOpacity>
                            )
                        }}
                    />
                    <Text style={styles.headerText}>Movies</Text>
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
                            renderItem={({ item }) => {
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
            <UserProfileModal
                isVisible={showUserProfileModal}
                setIsVisible={setShowUserProfileModal}
                username={selectedUserUsername}
                userUID={selectedUserUID}
                userCurrentlyFollowing={userFollowingList}
                setUserCurrentlyFollowing={setUserFollowingList}
            />
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

    textInput: {
        marginLeft: 5,
        color: 'white',
        width: 'auto',
        flex: 1,
        fontSize: 18,
        fontFamily: 'Poppins'
    },

    headerText: {
        color: COLOURS.orange,
        marginLeft: 20,
        marginTop: 20,
        fontFamily: 'PoppinsBold',
        fontSize: 30,
    },

    searchResultsContainer: {
        flex: 1
    }
})