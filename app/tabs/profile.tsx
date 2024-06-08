import { View, Image, Text, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
export default function profile() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={'Profile'} />

      <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(4), color: '#333', marginLeft: 18 }}>Hi there!</Text>
      <Text style={{ fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(2.2), color: 'green', marginLeft: 18 }}>Joined in may 2024</Text>

      <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
        <Image style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 15 }} source={require('../../assets/images/homepage-con.png')} />
        <View style={{ marginLeft: 25, width: '70%', }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.2), color: '#333', }}>Name</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: 'green', }}>Mahesh patra</Text>

        </View>

      </View>
      <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
        <Image style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 15 }} source={require('../../assets/images/icon-new1.png')} />
        <View style={{ marginLeft: 25, width: '70%', }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.2), color: '#333', }}>Mobile Number</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: 'green', }}>+91 816754454</Text>

        </View>

      </View>
      <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
        <Image resizeMode='cover' style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 15 }} source={require('../../assets/images/iconnew-2.png')} />
        <View style={{ marginLeft: 25, width: '70%', }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.2), color: '#333', }}>Email Id</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: 'green', }}>mahehspatra@gmail.com</Text>

        </View>

      </View>

      <View style={{ position: 'absolute', bottom: 20, width: '90%', alignSelf: 'center' }}>
        <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(3), color: '#555', alignSelf: 'center', textAlign: 'center' }}>Thank you for using IR Pharmacy</Text>
        <TouchableOpacity style={{ flexDirection: 'row', width: '60%', alignSelf: 'center', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#333', marginTop: 10 }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.8), color: '#333', alignSelf: 'center', textAlign: 'center' }}>Log Out</Text>
          <MaterialIcons size={responsiveScreenFontSize(3)} style={{ marginLeft: 20 }} name="logout" color={'#555'} />

        </TouchableOpacity>
      </View>



    </View>
  )
}