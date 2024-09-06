import { ImageBackground, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { COLOURS } from '../../../theme/theme'
import { screenDimensions } from '../../../constants/screenDimensions'
import SettingsContext from '../../../contexts/SettingsContext'


const SettingsScreen = ({ navigation }) => {
  
  const { showAdultFilms, setShowAdultFilms } = useContext(SettingsContext)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../../assets/background.png')}>

        <TouchableOpacity style={styles.goBackIconContainer} onPress={() => {
          navigation.navigate('ProfileAndSettingsScreen')
        }}>
          <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
        </TouchableOpacity>

        <View style={styles.contentSettingContainer}>
          <Text style={styles.settingsHeader}>Content Restrictions</Text>

          <View
            style={{
              justifyContent: "space-between",
              width: '90%',
              borderTopWidth: 1, 
              borderBottomWidth: 1,
              borderTopColor: COLOURS.orange,
              borderBottomColor: COLOURS.orange,
              alignSelf: 'center',
              height: 50,
              alignItems: 'center',
              flexDirection: 'row'
            }}
          >
            <Text
              style={{
                color: COLOURS.orange,
                fontFamily:"BrandonGrotesqueMedium"
              }}
            >Show Adult Films
            </Text>

            <Switch 
              value={showAdultFilms}
              onValueChange={(val) => setShowAdultFilms(val)}
              trackColor={{false: 'black', true: '#8c592e'}}
              thumbColor={showAdultFilms ? COLOURS.orange : 'gray'}
            />
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

export default SettingsScreen

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

  contentSettingContainer:{
    backgroundColor: COLOURS.settingsBackgroud,
    borderRadius: 20,
    width: '90%',
    height: 'auto',
    top: screenDimensions.StatusBarHeight + 70,
    paddingBottom: 20
  },

  settingsHeader: {
    color: COLOURS.orange,
    fontFamily: "PoppinsBold",
    margin: 10,
    fontSize: 20,
  }
})