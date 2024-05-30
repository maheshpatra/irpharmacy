import React from 'react'
import { View, Text, TouchableOpacity, Alert,NativeModules,Image } from 'react-native'
import Colors from '../../constants/Colors'
import {Entypo,Ionicons,AntDesign} from '@expo/vector-icons';
import { router, useRouter } from 'expo-router';
const HeaderAB = ({ title,notification }) => {
    const {StatusBarManager} = NativeModules;
    const router = useRouter() 
    const height = StatusBarManager.HEIGHT;
    return (
        <View style={{ height: 59, width: '100%', backgroundColor: Colors.backgroundcolor, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 15,marginTop:height }}>
            <TouchableOpacity onPress={()=>router.back()}>
                <AntDesign name="arrowleft" color={'#fff'} size={24} />
            </TouchableOpacity>
            <Text style={{color:'#fff',fontWeight:'bold',fontSize:19,letterSpacing:.5}}>{title}</Text>
           { notification ? <View>
            <Image  source={require('../../assets/images/logo.png')} style={{height:30,width:30,alignSelf:'center'}} />
                </View>:<View style={{width:30}} />}
            

        </View>
    )
}

export default HeaderAB