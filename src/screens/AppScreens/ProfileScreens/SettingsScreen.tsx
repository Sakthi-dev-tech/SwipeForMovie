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
import { Picker } from '@react-native-picker/picker'


const SettingsScreen = ({ navigation }) => {

  const { showAdultFilms, setShowAdultFilms, temperatureForMovieRecommendation, setTemperatureForMovieRecommendations } = useContext(SettingsContext)
  const { user, appState } = useContext(AuthContext)
  const isFocused = useIsFocused()
  const [temperature, setTemperature] = useState(temperatureForMovieRecommendation)
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  useEffect(() => {
    if (!isFocused || !(appState === 'active')) {
      setTemperatureForMovieRecommendations(temperature)
    }
  }, [isFocused, appState])

  const temperatureDropdown = [
    { label: 'Very Similar', value: 0.85 },
    { label: 'Similar', value: 0.70 },
    { label: 'Somewhat Similar', value: 0.55 }
  ]

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

          <View style={[styles.specificSettingSection, { height: 50 }]}>
            <Text style={{ color: COLOURS.orange, fontFamily: 'BrandonGrotesqueMedium' }}>Recommendation Similarity</Text>
            <Picker
              selectedValue={selectedLabel}
              onValueChange={(itemValue, itemIndex) => {
                setSelectedLabel(temperatureDropdown[itemIndex].label)
                setTemperature(temperatureDropdown[itemIndex].value)
              }}
              style={styles.picker}
              dropdownIconColor={COLOURS.orange}
            >
              {temperatureDropdown.map((option) => (
                <Picker.Item key={option.value} label={option.label} value={option.value} />
              ))}
            </Picker>
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
    flexDirection: 'row',
  },

  picker: {
    height: 50,
    width: '30%'
  },
})