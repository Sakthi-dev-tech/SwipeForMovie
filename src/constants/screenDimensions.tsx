import { Dimensions } from "react-native";
import { StatusBar } from "react-native";

const { height, width } = Dimensions.get('window')

export const screenDimensions = {
    screenWidth: width,
    screenHeight: height,
    StatusBarHeight: StatusBar.currentHeight || 0
}
