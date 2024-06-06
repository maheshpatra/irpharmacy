import { View, Text,Image } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { StatusBar } from 'expo-status-bar'
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
export default function OrderConfirm() {
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
        <StatusBar backgroundColor='#fff' />
      <Header title={'Order'} />

      <View style={{width:responsiveScreenWidth(70),height:responsiveScreenWidth(90),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
      <Image resizeMode='stretch' source={require('../assets/images/orderplaced.png')} style={{height:responsiveScreenWidth(40),width:responsiveScreenWidth(40),alignSelf:'center',}} />
      <Text style={{fontWeight: "bold", fontSize: responsiveScreenFontSize(2.3),color:'#333'}}>Order Placed Sucessfully</Text>
     
      </View>
      <Text style={{fontFamily:'novaregular',fontSize: responsiveScreenFontSize(2),color:'#8dc34b',alignSelf:'center'}}>Thamk you for shopping with IR Pharmacy</Text>

      <View style={{width:'100%',height:5,backgroundColor:'#ebedec',marginTop:20}} />


      <View style={{height:150,width:'90%',alignSelf:'center',backgroundColor:'#fff',marginTop:20,borderTopLeftRadius:10,borderTopRightRadius:10,borderWidth:2,borderColor:'#ddd'}}>
      <LinearGradient
      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        // Button Linear Gradient
        colors={['#cce9a2', '#fff',]}
        style={{height:40,borderTopLeftRadius:10,borderTopRightRadius:10}}>
        {/* <Text style={styles.text}>Sign in with Facebook</Text> */}
      </LinearGradient>
      </View>
      
    </View>
  )
}