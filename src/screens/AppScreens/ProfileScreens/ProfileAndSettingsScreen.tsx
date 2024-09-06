import { View, Text, SafeAreaView, ImageBackground, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { screenDimensions } from '../../../constants/screenDimensions'
import { COLOURS } from '../../../theme/theme'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'

const ProfileAndSettingsScreen = ({ navigation }) => {

    const [profileImgURI, setProfileImgURI] = useState<string>('')

    function handleSignOut() {
        navigation.replace("SignInScreen")
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../../assets/background.png')}>
                <View style={{ height: screenDimensions.StatusBarHeight + 60 }} />

                <TouchableOpacity style={styles.goBackIconContainer} onPress={() => navigation.navigate("Profile")}>
                    <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.profileContainer} onPress={() => {
                    navigation.navigate('EditProfile')
                }}>

                    <View style={styles.profilePicAndTextsContainer}>
                        <Image style={styles.profileImg}
                            source={profileImgURI ? { uri: profileImgURI } : require('../../../assets/default.png')}
                        />
                        <View style={styles.textContainer}>
                            <Text style={styles.settingHeaderText}>Profile</Text>
                            <Text style={styles.settingInfoText}>Edit your profile</Text>
                            <Text style={styles.settingInfoText}>Change Password</Text>
                        </View>

                    </View>
                    <View style={{ marginRight: 10 }}>
                        <FontAwesome name='chevron-right' size={20} color={'white'} />
                    </View>

                </TouchableOpacity>

                <TouchableOpacity style={styles.profileContainer} onPress={() => {
                    navigation.navigate('EditSettings')
                }}>

                    <View style={styles.profilePicAndTextsContainer}>
                        <View style={styles.textContainer}>
                            <Text style={styles.settingHeaderText}>Settings</Text>
                            <Text style={styles.settingInfoText}>Content Rules</Text>
                        </View>

                    </View>
                    <View style={{ marginRight: 10 }}>
                        <FontAwesome name='chevron-right' size={20} color={'white'} />
                    </View>
                </TouchableOpacity>

                <Text style={styles.signOutText} onPress={() => handleSignOut()}>Sign Out</Text>
            </ImageBackground>
        </SafeAreaView>
    )
}

export default ProfileAndSettingsScreen

const styles = StyleSheet.create({

    goBackIconContainer: {
        width: 40,
        height: 40,
        backgroundColor: COLOURS.orange,
        borderRadius: 50,
        position: 'absolute',
        top: screenDimensions.StatusBarHeight + 10,
        left: 10,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
    },

    profileContainer: {
        marginVertical: 10,
        width: '95%',
        height: 150,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: COLOURS.secondary,
        flexDirection: 'row',
        overflow: 'hidden',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    profilePicAndTextsContainer: {
        height: '100%',
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center',
    },

    profileImg: {
        width: '35%',
        aspectRatio: 1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: COLOURS.secondary
    },

    textContainer: {
        width: '65%',
        flex: 1,
        marginLeft: 15
    },

    settingHeaderText: {
        fontFamily: 'Quicksand',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 25,
        marginVertical: 5
    },

    settingInfoText: {
        fontFamily: 'Quicksand',
        color: COLOURS.secondary,
        fontSize: 15,
        fontWeight: '600'
    },

    signOutText: {
        color: COLOURS.red,
        fontSize: 20,
        fontFamily: 'Poppins',
        marginTop: 20
    }
})