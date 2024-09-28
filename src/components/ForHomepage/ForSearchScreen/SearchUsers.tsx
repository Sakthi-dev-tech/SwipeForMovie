import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { STORAGE } from '../../../../firebase.config';
import { getDownloadURL, ref } from 'firebase/storage';

const SearchUsers = (props) => {
    const [profileURI, setProfileURI] = useState<string>('');

    useEffect(() => {
        const getUserImage = async () => {
            const reference = ref(STORAGE, `gs://swipeformovie.appspot.com/profileImages/${props.userID}.jpg`)
            await getDownloadURL(reference).then((uri) => {
                setProfileURI(uri)
            }).catch((err) => {
                setProfileURI('')
                console.error("Error while fetching picture in search screen: ", err)
            })
        }
        getUserImage();
    }, [])

    return (
        <View style={{alignItems: 'center'}}>
            <Image style={styles.container} source={profileURI ? { uri: profileURI } : require('../../../assets/default.png')} />
            <Text style={styles.username}>{props.username}</Text>
        </View>
    )
}

export default SearchUsers

const styles = StyleSheet.create({
    container: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginHorizontal: 5
    },

    username: {
        color: 'white',
        marginTop: 5,
        fontFamily: 'Poppins'
    }
})