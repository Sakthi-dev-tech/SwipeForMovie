import { Image, StyleSheet, Text, View} from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { arrayRemove, doc, getDoc, updateDoc } from 'firebase/firestore'
import { FIRESTORE, STORAGE } from '../../../firebase.config'
import { getDownloadURL, ref } from 'firebase/storage'
import AuthContext from '../../contexts/AuthContext'
import { FirebaseError } from 'firebase/app'

const FriendProfileContainer = (props) => {

    const {user}  = useContext(AuthContext)

    const [username, setUsername] = useState<string>('')
    const [image, setImage] = useState<string>('')

    useEffect(() => {
        // check if the user's account has been deleted or not
        const checkAccAvailability = async () => {
            await getDoc(doc(FIRESTORE, 'userInfo', props.displayedFriendUID)).then((snapshot) => {
                if (!snapshot.exists()) {
                    // remove user from the following list if this user cannot be found in the userInfo collection of Firestore
                    const removeUserFromFollowing = async () => {
                        await updateDoc(doc(FIRESTORE, 'userFollowing', user.uid), {
                            following: arrayRemove(props.displayedFriendUID)
                        })
                    }

                    removeUserFromFollowing();
                }
            })
        }
 
        checkAccAvailability();
    }, [])

    useEffect(() => {
        const getUsername = async () => {
            await getDoc(doc(FIRESTORE, 'userInfo', props.displayedFriendUID)).then((snapshot) => {
                if (snapshot.exists()){
                    setUsername(snapshot.get('username'))
                }
            })
        }

        const getUserImage = async () => {
            const reference = ref(STORAGE, `gs://swipeformovie.appspot.com/profileImages/${props.displayedFriendUID}.jpg`)
            await getDownloadURL(reference).then((uri) => {
                setImage(uri)
            }).catch((err) => {
                setImage('')
                if (err instanceof FirebaseError){
                    if (err.code === 'storage/object-not-found') {
                        return
                    }
                } else {
                    console.error("Error while fetching picture in FriendProfileContainer: ", err)
                }
            })
        }

        getUsername();
        getUserImage();
    }, [])
    return (
        <View style={styles.imageContainer}>
            <Image style={{height: '85%', aspectRatio: 1, borderRadius: 50}} source={image ? {uri: image} : require('../../assets/default.png')}>
    
            </Image>
            <Text style={styles.usernameText}>{username}</Text>
        </View>
    )
}

export default FriendProfileContainer

const styles = StyleSheet.create({
    imageContainer: { 
        aspectRatio: 1,
        height: '80%',
        borderRadius: 50,
        alignItems: 'center'
    },

    usernameText: {
        color: 'white',
        fontSize: 10,
        marginTop: 5
    }
})