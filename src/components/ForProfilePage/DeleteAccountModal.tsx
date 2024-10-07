import { ActivityIndicator, ImageBackground, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { COLOURS } from '../../theme/theme'
import { screenDimensions } from '../../constants/screenDimensions'
import Entypo from 'react-native-vector-icons/Entypo'
import { deleteUser } from 'firebase/auth'
import AuthContext from '../../contexts/AuthContext'
import { deleteDoc, doc } from 'firebase/firestore'
import { FIRESTORE, STORAGE } from '../../../firebase.config'
import { supabase } from '../../Embeddings/supabase'
import { deleteObject, ref } from 'firebase/storage'
import { Snackbar } from 'react-native-paper'

const DeleteAccountModal = (props) => {

    const { user } = useContext(AuthContext)
    const [deletingAcc, setDeletingAcc] = useState<boolean>(false)

    const [snackBarMessage, setSnackBarMessage] = useState<string>('');
    const [snackBarVisible, setSnackBarVisible] = useState<boolean>(false);

    async function handleDeleteAccount() {
        try {
            setDeletingAcc(true)

            // delete user information from firebase
            await deleteDoc(doc(FIRESTORE, 'userFollowing', user.uid))
            await deleteDoc(doc(FIRESTORE, 'userInfo', user.uid))
            await deleteDoc(doc(FIRESTORE, 'userSettings', user.uid))

            // delete user profile picture
            await deleteObject(ref(STORAGE, `gs://swipeformovie.appspot.com/profileImages/${user.uid}.jpg`))

            // delete information from supabase
            const { data, error } = await supabase
                .from("UsersMovieData")
                .delete()
                .eq("userID", user.uid)

            if (error) {
                console.error(error)
                setSnackBarMessage("Something went wrong while deleting your account!")
                setSnackBarVisible(true)
            }

            // delete account from firestore auth
            await deleteUser(user)

            setSnackBarMessage("Account deleted successfully!")
            setSnackBarVisible(true)
        } catch (err) {
            if (err) {
                console.error(err)
                setSnackBarMessage("Something went wrong while deleting your account!")
                setSnackBarVisible(true)
            }
        } finally {
            setDeletingAcc(false)
        }

    }

    if (deletingAcc) {
        return (
            <Modal
                visible={deletingAcc}
            >
                <ImageBackground source={require("../../assets/background.png")} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <ActivityIndicator
                        style={{ backgroundColor: 'transparent' }}
                        color={COLOURS.orange}
                        size={'large'}
                    />

                    <Text style={{
                        color: COLOURS.orange,
                        marginTop: 20,
                        fontSize: 15,
                        fontFamily: "Lato"
                    }}>Account being deleted! Please wait!</Text>

                    <Snackbar
                        visible={snackBarVisible}
                        onDismiss={() => setSnackBarVisible(false)}
                        duration={2000}
                        style={{ backgroundColor: COLOURS.settingsBackgroud }}
                    >
                        <Text style={{ color: COLOURS.orange }}>{snackBarMessage}</Text>
                    </Snackbar>
                </ImageBackground>
            </Modal>
        )
    }

    return (
        <Modal
            visible={props.showModal}
            onRequestClose={() => props.setShowModal(false)}
        >
            <View style={{
                flex: 1,
                backgroundColor: 'rgba(0, 0, 0, 1)',
                alignItems: 'center',
                justifyContent: 'center',
            }}>

                <View style={styles.container}>
                    <Text style={styles.header}>Delete Account</Text>

                    <Text style={styles.text}>Are you sure that you want to leave us?</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: 'red' }]}
                            onPress={() => { props.setShowModal(false) }}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={() => handleDeleteAccount()}>
                            <Text style={styles.buttonText}>Confirm</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    )
}

export default DeleteAccountModal

const styles = StyleSheet.create({
    container: {
        aspectRatio: 1.5,
        width: '80%',
        backgroundColor: COLOURS.settingsBackgroud,
        marginBottom: screenDimensions.StatusBarHeight,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },

    goBackIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: COLOURS.orange,
        borderRadius: 50,
        position: 'absolute',
        top: 10,
        left: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },

    header: {
        fontSize: 18,
        fontFamily: 'PoppinsBold',
        color: COLOURS.orange,
    },

    text: {
        fontFamily: "Poppins",
        color: 'white',
        alignSelf: 'center'
    },

    buttonContainer: {
        flexDirection: 'row',
        width: '75%',
        marginTop: 20,
        justifyContent: "space-between"
    },

    button: {
        backgroundColor: COLOURS.secondary,
        width: '45%',
        height: 50,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: 'center'
    },

    buttonText: {
        fontFamily: "Poppins",
        color: "white"
    }
})