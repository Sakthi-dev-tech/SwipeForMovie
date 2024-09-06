import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { COLOURS } from '../../theme/theme'
import { LinearGradient } from 'expo-linear-gradient'

const LikeAndDislikeMovieCard = (props) => {
    return (
        <View style={[styles.container, props.isFirst ? {marginLeft: 20}: props.isLast ? {marginRight: 20} : {}]}>
            <TouchableOpacity onPress={props.cardFunction}>
                <Image style={[styles.moviePoster, {width: props.cardWidth}]} source={{ uri: props.imagePath }}></Image>
                <LinearGradient 
                    style={styles.linearGradient}
                    colors={['rgba(0, 0, 0, 0)','rgba(0, 0, 0, 100)']}
                >
                    <Text numberOfLines={1} style={styles.title}>{props.title}</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    )
}

export default LikeAndDislikeMovieCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: 'flex',
        backgroundColor: 'black',
        borderRadius: 20,
        overflow: 'hidden',
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

    title: {
        color: 'white',
        fontFamily: 'PlayFair',
        margin: 5,
    }
})