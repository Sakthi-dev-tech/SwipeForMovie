import { View, Text, SafeAreaView, ImageBackground } from 'react-native'
import React from 'react'

const SettingScreen = () => {
  return (
    <SafeAreaView style={{flex:1}}>
        <ImageBackground style={{flex: 1}} source={require('../../assets/background.png')}>

        </ImageBackground>
    </SafeAreaView>
  )
}

export default SettingScreen