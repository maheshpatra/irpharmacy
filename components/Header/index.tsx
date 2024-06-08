import React from 'react'
import { View,Image, Text, TouchableOpacity, Alert,NativeModules } from 'react-native'
import Colors from '../../constants/Colors'
import {Entypo,Ionicons} from '@expo/vector-icons';
import { responsiveScreenWidth } from 'react-native-responsive-dimensions';
const Header = ({ title,icon }) => {
    const {StatusBarManager} = NativeModules;

    const height = StatusBarManager.HEIGHT;
    return (
        <View style={{ height: 59, width: '100%', backgroundColor: Colors.backgroundcolor, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15,marginTop:height }}>
            
            <Text style={{color:'#555',fontWeight:'bold',fontSize:20,letterSpacing:.5}}>{title}</Text>
            <TouchableOpacity
            onPress={()=>{
                // notification press
            }}
            >
             <Image  source={require('../../assets/images/logo.png')} style={{height:responsiveScreenWidth(11),width:responsiveScreenWidth(17),alignSelf:'center'}} />
              </TouchableOpacity>

        </View>
    )
}

export default Header