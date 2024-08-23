import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Image } from 'react-native'

const genres = {
    28: 'Action',
    12: 'Adventure', 
    16: "Animation",
    35: 'Comedy',
    80: 'Crime',
    99: "Documentary",
    18: "Drama",
    10751: 'Family',
    14: "Fantasy",
    36: "History",
    27: "Horror",
    10402: 'Music',
    9648: "Mystery",
    10749: "Romance",
    878: "Science Fiction",
    10770: "TV Movie", 
    53: 'Thriller',
    10752: "War",
    37: "Western",
    10759: "Action & Adventure",
    10762: 'Kids',
    10763: "News",
    10764: "Reality",
    10765: "Sci-Fi & Fantasy",
    10766: "Soap",
    10767: "Talk",
    10768: "War/Politics",
}

const NowPlayingMovieCard = (props) => {

    return(
        <View style={[styles.container, props.isFirst ? {marginLeft: 20}: props.isLast ? {marginRight: 20} : {}, {maxWidth: props.cardWidth}]}>
            <TouchableOpacity onPress={props.cardFunction}>
                <Image style={[styles.moviePoster, {width: props.cardWidth}]} source={{ uri: props.imagePath }}></Image>
            </TouchableOpacity>

            <View style={styles.movieDetailContainer}>
                <Text style={styles.title}>{props.title}</Text>
                <View style={styles.ratingContainer}>
                    <Image source={require('../../assets/ratingIcon.png')} style={{ width: 18, height: 18}}/>
                    <Text style={{color: 'white', marginLeft: 5}}>{props.vote_average} ({props.vote_count})</Text>
                </View>

                <View style={styles.genreContainer}>
                    {
                        props.genreIDs.map((item) => {
                            return(
                                <View key={item} style={styles.genreBox}>
                                    <Text numberOfLines={2} style={{ color: 'gray', fontWeight: 'bold', fontSize: 10}}>{genres[item]}</Text>
                                </View>
                            )
                        })
                    }
                </View>
            </View>
        </View>
    )
}

export default NowPlayingMovieCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
    },

    moviePoster: {
        aspectRatio: 2/3,
        borderRadius: 20,
    },

    linearGradient: {
        position: 'absolute',
        alignSelf: 'center',
        bottom: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end'
    },
    
    movieDetailContainer:{
        alignItems: 'center',
        marginTop: 10,
        justifyContent: 'space-around',
        height: 100
    },

    title: {
        color: 'white',
        fontFamily: 'PlayFair',
        fontSize: 18
    },

    ratingContainer: {
        flexDirection: 'row',
        alignItems:"center"
    },

    genreContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        height: 40,
        justifyContent: 'space-between'
    },

    genreBox:{
        width: 70,
        height: 30,
        borderWidth: 2,
        borderColor: 'gray',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    }
})