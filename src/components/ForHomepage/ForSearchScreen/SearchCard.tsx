import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { baseImagePath } from '../../../api/MovieAPICall'
import { screenDimensions } from '../../../constants/screenDimensions'

const SearchCard = (props) => {

    return (
        <TouchableOpacity style={styles.container} onPress={props.touchFunction}>
            <Image source={{ uri: baseImagePath('w400', props.posterPath)}} style={styles.poster}/>
            <Text style={styles.text}>{props.title}</Text>
        </TouchableOpacity>
    )
}

export default SearchCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: screenDimensions.screenWidth / 2 - 40,
        justifyContent: 'center',
        alignItems: 'center',
        aspectRatio: 1/1.8,
        borderRadius: 10,
        marginHorizontal: 10,
        marginVertical: 15
    },

    poster: {
        height: '90%',
        width: '100%',
    },

    text: {
        color: 'white',
        fontFamily: "PoppinsBold",
        fontSize: 15
    }
})