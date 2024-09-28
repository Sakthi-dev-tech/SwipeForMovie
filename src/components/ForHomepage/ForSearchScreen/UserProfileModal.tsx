import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { screenDimensions } from '../../../constants/screenDimensions'
import { COLOURS } from '../../../theme/theme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { FIRESTORE, STORAGE } from '../../../../firebase.config'
import { getDownloadURL, ref } from 'firebase/storage'
import { arrayRemove, arrayUnion, doc, FieldValue, updateDoc } from 'firebase/firestore'
import AuthContext from '../../../contexts/AuthContext'

const UserProfileModal = (props) => {

    const { user } = useContext(AuthContext) 
    
    const [following, setFollowing] = useState<boolean>(false)
    const [profileImage, setProfileImage] = useState<string>('');

    useEffect(() => {
        const getUserImage = async () => {
            const reference = ref(STORAGE, `gs://swipeformovie.appspot.com/profileImages/${props.userUID}.jpg`)
            await getDownloadURL(reference).then((uri) => {
                setProfileImage(uri)
            }).catch((err) => {
                setProfileImage('')
                console.error("Error while fetching picture in UserProfileModal: ", err)
            })
        }

        const checkIfUserAlreadyIsFollowed = () => {
            if (Array.isArray(props.userCurrentlyFollowing) && props.userCurrentlyFollowing.includes(props.userUID)) {
                setFollowing(true)
            } else {
                setFollowing(false)
            }
        }

        if (props.userUID){
            getUserImage();
            checkIfUserAlreadyIsFollowed();
        }
    }, [props.userUID]);

    async function handleCancelButton() {
        props.setIsVisible(false)

        if (following) {
            // handle when the user wants to follow the user
            if (Array.isArray(props.userCurrentlyFollowing) && !props.userCurrentlyFollowing.includes(props.userUID)) {
                // if user not already in the database
                await updateDoc(doc(FIRESTORE, 'userFollowing',user.uid), {
                    following: arrayUnion(props.userUID)
                })
                props.setUserCurrentlyFollowing([...props.userCurrentlyFollowing, props.userUID])
            }
        } else {
            // handle when the user wants to unfollow the user
            if (Array.isArray(props.userCurrentlyFollowing) && props.userCurrentlyFollowing.includes(props.userUID)) {
                // if user already in the database
                await updateDoc(doc(FIRESTORE, 'userFollowing',user.uid), {
                    following: arrayRemove(props.userUID)
                })
                props.setUserCurrentlyFollowing((prevUsers) => prevUsers.filter(user => user !== props.userUID));
            }
        }
    }

    return (
        <Modal
            visible={props.isVisible}
            onRequestClose={() => handleCancelButton()}
            style={{ flex: 1 }}
            transparent={true}
        >
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.85)' }}>
                <View style={styles.container}>
                    <View style={styles.profilePicAndUsernameContainer}>
                        <Image style={{ aspectRatio: 1, width: 80, borderRadius: 50 }} source={profileImage ? { uri: profileImage } : require('../../../assets/default.png')} />
                        <Text style={{ color: 'white', fontFamily: 'PoppinsBold', fontSize: 25, marginTop: 10 }}>{props.username}</Text>
                    </View>
                    <View style={styles.followButtonContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => handleCancelButton()}>
                            <Text style={styles.buttonText}>Done</Text>
                        </TouchableOpacity>

                        {
                            following ? (
                                <TouchableOpacity onPress={() => setFollowing(!following)} style={[styles.button, { backgroundColor: 'black', width: 200 }]}>
                                    <Image source={require('../../../assets/icons/person-tick.png')} style={{ aspectRatio: 1, width: 20, tintColor: 'white' }} />
                                    <Text style={styles.buttonText}>Following</Text>
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity onPress={() => setFollowing(!following)} style={[styles.button, { backgroundColor: COLOURS.orange, width: 200 }]}>
                                    <Ionicons name='person-add' size={20} />
                                    <Text style={styles.buttonText}>Follow</Text>
                                </TouchableOpacity>
                            )
                        }
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default UserProfileModal

const styles = StyleSheet.create({
    container: {
        aspectRatio: 2,
        width: screenDimensions.screenWidth - 40,
        backgroundColor: COLOURS.settingsBackgroud,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'space-around'
    },

    profilePicAndUsernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        width: '100%',
    },

    followButtonContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },

    button: {
        width: 100,
        height: 50,
        backgroundColor: COLOURS.red,
        borderRadius: 50,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginHorizontal: 10,
        flexDirection: 'row',
    },

    buttonText: {
        color: 'white',
        fontFamily: 'Poppins',
    }
})