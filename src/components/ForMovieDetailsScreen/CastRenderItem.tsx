import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { screenDimensions } from '../../constants/screenDimensions'
import MaterialCommunityIcon from 'react-native-vector-icons/AntDesign'

const CastRenderItem = (props) => {

    return (
        <View style={styles.castDetailContainer}>
            {!props.avatarNull ? (
                    <Image style={styles.avatar} source={{ uri: props.avatarURI }} />
                ) : (
                    <View style={styles.avatar}>
                        <MaterialCommunityIcon name='user' size={35} color={'white'}/>
                    </View>
                )}
            <Text style={styles.name} numberOfLines={2}>{props.name}</Text>
            <Text numberOfLines={2} style={styles.characterName}>{props.characterName}</Text>
        </View>
    )
}

export default CastRenderItem

const styles = StyleSheet.create({
    castDetailContainer: {
        flex: 1,
        width: screenDimensions.screenWidth / 5,
    },

    avatar: {
        width: '95%',
        aspectRatio: 1,
        borderRadius: 100,
        backgroundColor: 'black',
        justifyContent: 'center',
        alignItems:"center"
    },

    name: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Poppins',
        height: 35,
        marginVertical: 5
    },

    characterName:{
        color: 'gray',
        fontSize: 9,
        fontFamily: 'Poppins',

    }
})