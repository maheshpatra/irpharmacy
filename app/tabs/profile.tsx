import { View, Image, Text, FlatList, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import { _retrieveData,_removeData } from "../../local_storage";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';
export default function profile() {
  
  const [data, setData]=useState(null)


  useEffect(() => {

    _retrieveData("USER_DATA").then((userdata) => {
      console.log(userdata);
      if (userdata && userdata !== 'error') {
       setData(userdata)
        
      } else {
       Alert.alert('Error','user not found!')
        
      }

    });
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={'Profile'} />

      <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(4), color: '#333', marginLeft: 18 }}>Hi there!</Text>
      <Text style={{ fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(2.2), color: 'green', marginLeft: 18 }}>Joined in may 2024</Text>

      <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
        <Image resizeMode='center' style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 15 }} source={require('../../assets/images/homepage-con.png')} />
        <View style={{ marginLeft: 25, width: '70%', }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.2), color: '#333', }}>Name</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: 'green', }}>{data?.username}</Text>

        </View>

      </View>
      <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
        <Image resizeMode='center' style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 15 }} source={require('../../assets/images/icon-new1.png')} />
        <View style={{ marginLeft: 25, width: '70%', }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.2), color: '#333', }}>Mobile Number</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: 'green', }}>+91 {data?.mobile}</Text>

        </View>

      </View>
      <View style={{borderBottomWidth:1,paddingBottom:15, marginTop: 20, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
        <Image resizeMode='center' style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 15 }} source={require('../../assets/images/iconnew-2.png')} />
        <View style={{ marginLeft: 25, width: '70%', }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.2), color: '#333', }}>Email Id</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: 'green', }}>{data?.email}</Text>

        </View>

      </View>
      <TouchableOpacity style={{ alignSelf: 'center', height: 35, justifyContent: 'center',  borderRadius: 6,  marginTop: 25 }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.8), color: '#333', alignSelf: 'center', textAlign: 'center' }}>Contact us</Text>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.), color: '#333', alignSelf: 'center', textAlign: 'center' }}>support@irpharmacy.com</Text>

        </TouchableOpacity>

      <View style={{ position: 'absolute', bottom: 20, width: '90%', alignSelf: 'center' }}>
        <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(3), color: '#555', alignSelf: 'center', textAlign: 'center' }}>Thank you for using IR Pharmacy</Text>
        <TouchableOpacity onPress={() => {
                            _removeData('USER_DATA')
                                .then(v => {
                                   if (v === "removed") {
                                        console.log(v)
                                        router.push('/')
                                    }
                                })
                                .catch(err => alert('Failed To Logout'));
                            
                            }} style={{ flexDirection: 'row', width: '60%', alignSelf: 'center', height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 6, borderWidth: 1, borderColor: '#333', marginTop: 10 }}>
          <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.8), color: '#333', alignSelf: 'center', textAlign: 'center' }}>Log Out</Text>
          <MaterialIcons size={responsiveScreenFontSize(3)} style={{ marginLeft: 20 }} name="logout" color={'#555'} />

        </TouchableOpacity>
      </View>



    </View>
  )
}