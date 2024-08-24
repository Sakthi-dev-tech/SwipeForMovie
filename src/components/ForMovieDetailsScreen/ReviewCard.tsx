import { Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { COLOURS } from '../../theme/theme'
import { screenDimensions } from '../../constants/screenDimensions'
import { baseImagePath } from '../../api/MovieAPICall'

const ReviewCard = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.userInformation}>
                <Image style={{ aspectRatio: 1, width: 50, borderRadius: 100, marginHorizontal: 10 }} source={props.authorAvatar ? { uri: baseImagePath("w200", props.authorAvatar) } : require('../../assets/default.png')} />
                <Text style={styles.username}>{props.authorUsername}</Text>
            </View>

            <View style={styles.review}>
                <Text numberOfLines={4} style={styles.reviewText}>{props.review}</Text>
            </View>
        </View>
    )
}

export default ReviewCard

const styles = StyleSheet.create({
    container: {
        width: screenDimensions.screenWidth * 0.9,
        height: '100%',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLOURS.orange,
        borderRadius: 5,
    },

    userInformation: {
        flexDirection: 'row',
        width: '40%',
        height: '35%',
        alignItems: 'center',
        marginTop: 10
    },

    username: {
        color: 'white',
        marginHorizontal: 10,
        fontFamily: 'Quicksand',
        fontWeight: '800'
    },

    review: {
        flex: 1,
        marginTop: 10,
    },

    reviewText: {
        color: 'white',
        marginHorizontal: 10,
        fontFamily: 'Quicksand',
        fontWeight: '600',
        textAlign: 'justify',
    }
})