import { ImageBackground, SafeAreaView, StyleSheet, Switch, Text, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import Entypo from 'react-native-vector-icons/Entypo'
import { COLOURS } from '../../../theme/theme'
import { screenDimensions } from '../../../constants/screenDimensions'
import SettingsContext from '../../../contexts/SettingsContext'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { FIRESTORE } from '../../../../firebase.config'
import AuthContext from '../../../contexts/AuthContext'
import Slider from '@react-native-community/slider'
import { useIsFocused } from '@react-navigation/native'


const SettingsScreen = ({ navigation }) => {

  const { showAdultFilms, setShowAdultFilms, temperatureForMovieRecommendation, setTemperatureForMovieRecommendations } = useContext(SettingsContext)
  const { user, appState } = useContext(AuthContext)
  const isFocused = useIsFocused()
  const [temperature, setTemperature] = useState(temperatureForMovieRecommendation)

  useEffect(() => {
    if (!isFocused || !(appState === 'active')) {
      setTemperatureForMovieRecommendations(temperature)
    }
  }, [isFocused, appState])

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground style={{ flex: 1, alignItems: 'center' }} source={require('../../../assets/background.png')}>

        <TouchableOpacity style={styles.goBackIconContainer} onPress={() => {
          navigation.navigate('ProfileAndSettingsScreen')
        }}>
          <Entypo name='chevron-with-circle-left' color={'white'} size={30} />
        </TouchableOpacity>

        <View style={styles.contentSettingContainer}>
          <Text style={styles.settingsHeader}>Movie Recommendation</Text>

          <View style={[styles.specificSettingSection, { height: 85, flexDirection: 'column', justifyContent: 'center' }]}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: COLOURS.orange, fontFamily: "BrandonGrotesqueMedium" }}>Similarity To Your Favourite Movies: </Text>
              <Text style={{color: COLOURS.orange, fontFamily: "PoppinsBold", marginLeft: 10}}>{temperature.toFixed(2).toString()}</Text>
            </View>
            <Slider
              style={{ width: 300, height: 40 }}
              minimumValue={0}
              maximumValue={0.99}
              minimumTrackTintColor={COLOURS.orange}
              maximumTrackTintColor="#D3D3D3"
              thumbTintColor={COLOURS.orange}
              value={temperature}
              onValueChange={(sliderValue) => {
                setTemperature(parseFloat(sliderValue.toFixed(2)))
              }}
            />
          </View>
        </View>

        <View style={styles.contentSettingContainer}>
          <Text style={styles.settingsHeader}>Content Restrictions</Text>

          <View
            style={styles.specificSettingSection}
          >
            <Text
              style={{
                color: COLOURS.orange,
                fontFamily: "BrandonGrotesqueMedium"
              }}
            >Show Adult Films
            </Text>

            <Switch
              value={showAdultFilms}
              onValueChange={async (val) => {
                setShowAdultFilms(val)
                await updateDoc(doc(FIRESTORE, 'userSettings', user.uid), {
                  adult: val
                })
              }}
              trackColor={{ false: 'black', true: '#8c592e' }}
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

  contentSettingContainer: {
    backgroundColor: COLOURS.settingsBackgroud,
    borderRadius: 20,
    width: '90%',
    height: 'auto',
    top: screenDimensions.StatusBarHeight + 70,
    paddingBottom: 20,
    marginBottom: 20
  },

  settingsHeader: {
    color: COLOURS.orange,
    fontFamily: "PoppinsBold",
    margin: 10,
    fontSize: 20,
  },

  specificSettingSection: {
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
  }
})