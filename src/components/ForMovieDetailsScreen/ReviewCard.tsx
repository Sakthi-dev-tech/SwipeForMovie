import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { COLOURS } from '../../theme/theme'
import { screenDimensions } from '../../constants/screenDimensions'
import { baseImagePath } from '../../api/MovieAPICall'

const ReviewCard = (props) => {

    const [expandReview, setExpandReview] = useState<boolean>(false)

    return (
        <TouchableOpacity onPress={() => setExpandReview(!expandReview)}>
        <View style={styles.container}>
            <View style={styles.userInformation}>
                <Image style={{ aspectRatio: 1, width: 50, borderRadius: 100, marginHorizontal: 10 }} source={props.authorAvatar ? { uri: baseImagePath("w200", props.authorAvatar) } : require('../../assets/default.png')} />
                <Text style={styles.username}>{props.authorUsername}</Text>
            </View>

            <View style={styles.review}>
                <Text ellipsizeMode='tail' numberOfLines={expandReview ? undefined : 3} style={styles.reviewText}>{props.review}</Text>
            </View>
        </View>
        </TouchableOpacity>
    )
}

export default ReviewCard

const styles = StyleSheet.create({
    container: {
        width: screenDimensions.screenWidth * 0.9,
        height: 'auto',
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLOURS.orange,
        borderRadius: 20,
    },

    userInformation: {
        flexDirection: 'row',
        width: '40%',
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
        marginVertical: 10,
        height: 'auto',
    },

    reviewText: {
        color: 'white',
        marginHorizontal: 10,
        fontFamily: 'Quicksand',
        fontWeight: '600',
        textAlign: 'justify',
    }
})