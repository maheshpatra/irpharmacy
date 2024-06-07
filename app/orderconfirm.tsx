import { View, Text,Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import { StatusBar } from 'expo-status-bar'
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient';
import AntDesign from '@expo/vector-icons/AntDesign';
import { router } from 'expo-router'

export default function OrderConfirm() {
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
        <StatusBar backgroundColor='#fff' />
      <Header title={'Order'} />

      <View style={{width:responsiveScreenWidth(70),height:responsiveScreenWidth(85),alignSelf:'center',justifyContent:'center',alignItems:'center'}}>
      <Image resizeMode='stretch' source={require('../assets/images/orderplaced.png')} style={{height:responsiveScreenWidth(40),width:responsiveScreenWidth(40),alignSelf:'center',}} />
      <Text style={{fontWeight: "bold", fontSize: responsiveScreenFontSize(2.3),color:'#333'}}>Order Placed Sucessfully</Text>
     
      </View>
      <Text style={{fontFamily:'novaregular',fontSize: responsiveScreenFontSize(2),color:'#8dc34b',alignSelf:'center'}}>Thank you for shopping with IR Pharmacy</Text>

      <View style={{width:'100%',height:5,backgroundColor:'#ebedec',marginTop:20}} />


      <View style={{height:responsiveScreenWidth(45),width:'90%',alignSelf:'center',backgroundColor:'#fff',marginTop:20,borderTopLeftRadius:10,borderTopRightRadius:10,borderWidth:2,borderColor:'#ddd'}}>
      <LinearGradient
      start={{x: 0, y: 0}} end={{x: 1, y: 0}}
        // Button Linear Gradient
        colors={['#cce9a2', '#fff',]}
        style={{height:responsiveScreenWidth(12),borderTopLeftRadius:10,borderTopRightRadius:10,flexDirection:'row',alignItems:'center'}}>
          <Text style={{padding:2,backgroundColor:'green',color:'#fff',paddingHorizontal:4,borderRadius:8,marginLeft:10}}>Processing</Text>
          <Text style={{color:'#555',marginHorizontal:10,fontWeight:'bold',fontSize:responsiveFontSize(1.8)}}>Excepted Delivery on 05 June</Text>
          <AntDesign size={responsiveScreenFontSize(2)} name="right" color={'#555'} />
        {/* <Text style={styles.text}>Sign in with Facebook</Text> */}
      </LinearGradient>
      <View style={{width:'100%',height:responsiveScreenWidth(32),alignItems:'center',flexDirection:'row',justifyContent:'space-between',paddingHorizontal:responsiveScreenWidth(2)}}>
      <Image resizeMode='stretch' style={{height:responsiveScreenWidth(15),width:responsiveScreenWidth(15),marginLeft:15,borderWidth:1,borderColor:'#ccc',borderRadius:10,padding:5}} source={require('../assets/images/homepage-con.png')} />
      <Text style={{color:'#555',fontWeight:'bold',fontSize:responsiveFontSize(4),marginRight:10}}>₹ 160.00</Text>
           
      </View>

      </View>
      <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 6,
              width:'60%',
              alignSelf:'center'
            }}
            // disabled={!mobile && mobile?.length != 10}
           onPress={()=>router.push('checkout')}
          >
            {/* {loading ? (
              <ActivityIndicator />
            ) : ( */}
            <Text
              style={{ fontWeight: "bold", fontSize: responsiveFontSize(2), color: Colors.backgroundcolor }}
            >
              See Orders
            </Text>
            {/* )} */}
          </TouchableOpacity>
      
    </View>
  )
}