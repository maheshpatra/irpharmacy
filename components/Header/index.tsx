import React from 'react'
import { View,Image, Text, TouchableOpacity, Alert,NativeModules } from 'react-native'
import Colors from '../../constants/Colors'
import {Entypo,Ionicons} from '@expo/vector-icons';
const Header = ({ menuClicks,title,icon }) => {
    const {StatusBarManager} = NativeModules;

    const height = StatusBarManager.HEIGHT;
    return (
        <View style={{ height: 59, width: '100%', backgroundColor: Colors.backgroundcolor, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15,marginTop:height }}>
            <TouchableOpacity onPress={menuClicks}>
                <Entypo name="menu" color={'#fff'} size={26} />
            </TouchableOpacity>
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:20,letterSpacing:.5}}>{title}</Text>
            <TouchableOpacity
            onPress={()=>{
                // notification press
            }}
            >
             <Image  source={require('../../assets/images/logo.png')} style={{height:30,width:30,alignSelf:'center'}} />
              </TouchableOpacity>

        </View>
    )
}

export default Header