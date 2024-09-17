import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const FriendProfileContainer = (props) => {
    return (
        <Image style={styles.imageContainer} source={require('../../assets/default.png')}>

        </Image>
    )
}

export default FriendProfileContainer

const styles = StyleSheet.create({
    imageContainer: { 
        aspectRatio: 1,
        height: '80%',
        borderRadius: 50
    }
})