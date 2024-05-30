import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';

export default function Animation({height,width,autoplay,loop,url,style}) {
  return (
    <View>
       <LottieView style={[style, { width:width?width:50,height:height?height:50}]} source={url} autoPlay={autoplay} loop={loop} />
    </View>
  )
}