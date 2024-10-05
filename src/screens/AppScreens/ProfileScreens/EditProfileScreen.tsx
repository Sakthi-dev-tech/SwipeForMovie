import { Alert, Image, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { ImageBackground } from 'react-native'
import { COLOURS } from '../../../theme/theme'
import { screenDimensions } from '../../../constants/screenDimensions'
import Entypo from 'react-native-vector-icons/Entypo'
import * as ImagePicker from 'expo-image-picker'

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { Modal } from 'react-native'
import DeleteAccountModal from '../../../components/ForProfilePage/DeleteAccountModal'
import AuthContext from '../../../contexts/AuthContext'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { FIRESTORE, STORAGE } from '../../../../firebase.config'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { FirebaseError } from 'firebase/app'

const EditProfileScreen = ({ navigation, route }) => {

  const {profileImgURI} = route?.params

  const [imageURI, setImageURI] = useState<string | undefined>(profileImgURI)
  const [username, setUsername] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false); // Flag to track if user is editing

  const [currentPassword, setCurrentPassword] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [profileImageChanged, setProfileImageChanged] = useState<boolean>(false)

  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState<boolean>(false)
  const [showDeleteAccModal, setShowDeleteAccModal] = useState<boolean>(false)

  const { user } = useContext(AuthContext)

  useEffect(() => {
    const fetchProfileImage = async () => {
      const reference = ref(STORAGE, `gs://swipeformovie.appspot.com/profileImages/${user?.uid}.jpg`)
      await getDownloadURL(reference).then((uri) => {
        setImageURI(uri)
        setProfileImageChanged(false)
      })
    }

    if (profileImageChanged) {
      fetchProfileImage();
    }
  }, [profileImageChanged])

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(FIRESTORE, 'userInfo', user?.uid), (snapshot) => {
      if (snapshot.exists() && !isEditing) {
        setUsername(snapshot.get("username"))
      }
    })

    return () => unsubscribe();
  })

  async function handleChangeAvatar() {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
      base64: true,
    });

    if (!result.canceled) {

      const uid = user?.uid

      const reference = ref(STORAGE, `profileImages/${uid}.jpg`)

      const img = await fetch(result.assets[0].uri)
      const bytes = await img.blob(); //convert the image to array of bytes

      await uploadBytes(reference, bytes).then(() => {
        setProfileImageChanged(true)
      }).catch((err) => {
        Alert.alert("Error in uploading image", "There has been an error in uploading this image. Please do try again!")
        console.error(err)
      }) //upload the bytes to firebase storage
    }
  }

  async function handleSubmitChangePW() {
    if (currentPassword.length === 0 || password.length === 0 || confirmPassword.length === 0) {
      alert("Please ensure that you have all the fields filled up!")
    } else if (password !== confirmPassword){
      Alert.alert("Passwords do not match!", "Ensure your passwords match!")
    } else {
      try {
        // Re-authenticate the user with their current credentials
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
    
        await reauthenticateWithCredential(user, credential);
        if (currentPassword === password) {
          alert("Password already in use currently!")
          return
        }
    
        // Update the password after re-authentication
        await updatePassword(user, password)

        alert("Password changed successfully!")

        setCurrentPassword('')
        setPassword('')
        setConfirmPassword('')
        setChangePasswordModalVisible(false)
      } catch (error) {
        if (error instanceof FirebaseError) {
          if (error.code === 'auth/invalid-credential') {
            alert("Your current password is invalid");
          } else if (error.code === 'auth/user-mismatch') {
            alert("Provided credentials do not match any user!");
          } else if (error.code === 'auth/weak-password') {
            alert("Passowrd is too weak! Choose a password that is at least 6 characters long!");
          } else if (error.code === 'auth/too-many-requests') {
            alert("Too many requests! Try again later!");
          } else {
            console.error('Error re-authenticating or updating password: ', error);
          }
        }
      }
    }
  }

  async function handleChangeUsername() {
    await updateDoc(doc(FIRESTORE, 'userInfo', user?.uid), {
      'username': username
    }).then(() => {
      setIsEditing(false)
    })
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../../assets/background.png')}>

        <TouchableOpacity style={styles.goBackIconContainer} onPress={() => {
          navigation.navigate('ProfileAndSettingsScreen')
        }}>
          <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarContainer} onPress={() => handleChangeAvatar()}>
          <Image style={{ borderRadius: 500, width: '100%', height: '100%' }} source={imageURI ? { uri: imageURI } : require('../../../assets/default.png')} />
          <FontAwesome name='camera' color={'white'} size={20} style={{ position: 'absolute', bottom: 0, right: 0 }} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.usernameEditContainer}>
          <TextInput
            value={username}
            placeholder='Your username...'
            style={styles.usernameInput}
            cursorColor={COLOURS.orange}
            textAlign='center'
            placeholderTextColor={'gray'}
            onFocus={() => setIsEditing(true)}
            onChangeText={(text) => setUsername(text)}
            onEndEditing={async () => await handleChangeUsername()}
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
              }}>Enter your current password</Text>
              <TextInput
                value={currentPassword}
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
                onChangeText={(text) => setCurrentPassword(text)}
              />
              <Text style={{
                fontFamily: "Poppins",
                fontSize: 20,
                color: COLOURS.orange,
                marginLeft: 10
              }}>Enter your new password</Text>
              <TextInput
                value={password}
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
                onChangeText={(text) => setPassword(text)}
              />

              <Text style={{
                fontFamily: "Poppins",
                fontSize: 20,
                color: COLOURS.orange,
                marginLeft: 10
              }}>Re-enter your new password</Text>
              <TextInput
                value={confirmPassword}
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
                onChangeText={(text) => setConfirmPassword(text)}
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