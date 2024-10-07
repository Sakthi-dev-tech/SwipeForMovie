import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { baseImagePath } from '../../../api/MovieAPICall'
import { screenDimensions } from '../../../constants/screenDimensions'
import { COLOURS } from '../../../theme/theme'

const SearchCard = (props) => {

    return (
        <TouchableOpacity style={styles.container} onPress={props.touchFunction}>
            {
                props.posterPath ? (
                    <Image source={{ uri: baseImagePath('w400', props.posterPath)}} style={styles.poster}/>
                ) :(
                    <View style={{width: '100%', height: '90%', backgroundColor: COLOURS.secondary, borderRadius: 20}}></View>
                )
            }
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
        marginHorizontal: 10,
        marginVertical: 15,
        overflow: 'hidden'
    },

    poster: {
        height: '90%',
        width: '100%',
        borderRadius: 20
    },

    text: {
        color: 'white',
        fontFamily: "PoppinsBold",
        fontSize: 15
    }
})