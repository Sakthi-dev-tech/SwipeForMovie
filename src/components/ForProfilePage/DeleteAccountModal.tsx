import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { COLOURS } from '../../theme/theme'
import { screenDimensions } from '../../constants/screenDimensions'
import Entypo from 'react-native-vector-icons/Entypo'

const DeleteAccountModal = (props) => {

    function handleDeleteAccount() {
    
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
                        onPress={() => {props.setShowModal(false)}}>
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