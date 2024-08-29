import { Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { COLOURS } from '../../../theme/theme'
import { screenDimensions } from '../../../constants/screenDimensions'
import Entypo from 'react-native-vector-icons/Entypo'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Modal } from 'react-native'
import DeleteAccountModal from '../../../components/ForProfilePage/DeleteAccountModal'

const EditProfileScreen = ({ navigation }) => {

  const [imageURI, setImageURI] = useState<string | undefined>(undefined)
  const [username, setUsername] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState<boolean>(false)
  const [showDeleteAccModal, setShowDeleteAccModal] = useState<boolean>(false)

  function handleChangeAvatar() {

  }

  function handleSubmitChangePW() {

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../../assets/background.png')}>

        <TouchableOpacity style={styles.goBackIconContainer} onPress={() => {
          navigation.navigate('Profile')
        }}>
          <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarContainer} onPress={() => handleChangeAvatar()}>
          <Image style={{ borderRadius: 500, width: '100%', height: '100%' }} source={imageURI ? { uri: imageURI } : require('../../../assets/default.png')} />
          <FontAwesome name='camera' color={'white'} size={20} style={{ position: 'absolute', bottom: 0, right: 0 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.usernameEditContainer} onPress={() => handleChangeAvatar()}>
          <TextInput
            value={username}
            placeholder='Your username...'
            style={styles.usernameInput}
            cursorColor={COLOURS.orange}
            textAlign='center'
            placeholderTextColor={'gray'}
            onChangeText={(text) => setUsername(text)}
          />
          <FontAwesome name='pencil' color={'white'} size={20} style={{ position: 'absolute', bottom: 2, right: -20 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.changePWContainer} onPress={() => {
          setChangePasswordModalVisible(true)
        }}>
          <Text style={styles.settingHeader}>Change Password</Text>
          <View style={{ marginRight: 10 }}>
            <FontAwesome name='chevron-right' size={20} color={'white'} />
          </View>

        </TouchableOpacity>

        <Modal
          visible={changePasswordModalVisible}
          transparent={true}
          onRequestClose={() => setChangePasswordModalVisible(false)}
        >
          <View style={styles.changePWModal}>
            <View style={{
              justifyContent: 'space-around',
              marginTop: 10,
              flexDirection: 'row',
              width: '100%',
              alignItems: 'center'
            }}>
              <TouchableOpacity style={[styles.goBackIconContainer, { position: 'relative', top: 0, left: 0 }]} onPress={() => {
                setChangePasswordModalVisible(false)
              }}>
                <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
              </TouchableOpacity>

              <Text
                style={{
                  color: 'white',
                  fontFamily: "Poppins",
                  fontSize: 30,
                  marginTop: 10,
                }}
              >Password</Text>

              <TouchableOpacity style={[styles.goBackIconContainer, { position: 'relative', top: 0, left: 0 }]} onPress={() => {
                handleSubmitChangePW()
              }}>
                <Entypo name='check' color={'white'} size={30} />
              </TouchableOpacity>

            </View>
            <View style={{
              backgroundColor: COLOURS.settingsBackgroud,
              width: '95%',
              paddingVertical: 20,
              marginTop: 30,
              borderRadius: 30
            }}>
              <Text style={{
                fontFamily: "Poppins",
                fontSize: 20,
                color: COLOURS.orange,
                marginLeft: 10
              }}>Enter your new password</Text>
              <TextInput
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  backgroundColor: 'transparent',
                  fontFamily: 'Lato',
                  color: COLOURS.orange,
                  marginBottom: 10
                }}
                cursorColor={COLOURS.orange}
                secureTextEntry
                placeholder='Enter here...'
                placeholderTextColor={'white'}
              />

              <Text style={{
                fontFamily: "Poppins",
                fontSize: 20,
                color: COLOURS.orange,
                marginLeft: 10
              }}>Re-enter your new password</Text>
              <TextInput 
                style={{
                  width: '94%',
                  alignSelf: 'center',
                  fontFamily: 'Lato',
                  color: COLOURS.orange,
                }}
                cursorColor={COLOURS.orange}
                secureTextEntry
                placeholder='Enter here...'
                placeholderTextColor={'white'}
              />
            </View>
          </View>
        </Modal>

        <Text 
        style={styles.deleteAccountText}
        onPress={() => setShowDeleteAccModal(true)}
        >Delete Account</Text>

        <DeleteAccountModal 
          showModal={showDeleteAccModal}
          setShowModal={setShowDeleteAccModal}
        />

      </ImageBackground>
    </SafeAreaView>
  )
}

export default EditProfileScreen

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
  avatarContainer: {
    marginTop: screenDimensions.StatusBarHeight + 10,
    aspectRatio: 1,
    height: '12%',
  },

  usernameEditContainer: {
    marginTop: 20,
    width: '40%',
  },

  usernameInput: {
    backgroundColor: 'transparent',
    borderRadius: 10,
    color: 'white',
    fontFamily: 'PoppinsBold',
  },

  changePWContainer: {
    marginVertical: 15,
    width: '95%',
    height: 75,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLOURS.secondary,
    flexDirection: 'row',
    overflow: 'hidden',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  settingHeader: {
    color: COLOURS.orange,
    fontSize: 18,
    fontFamily: "PoppinsBold"
  },

  changePWModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 1)',
    alignItems: 'center'
  },

  deleteAccountText: {
    color: COLOURS.red,
    fontSize: 20,
    fontFamily: 'Poppins'
  }
})