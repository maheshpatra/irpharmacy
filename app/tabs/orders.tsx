import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import Header from '../../components/Header'
import AntDesign from '@expo/vector-icons/AntDesign';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';

export default function Orders() {
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
      <Header title={'Your Order'} />
      <FlatList
          data={['1', '2', '3']}
          renderItem={() =>

            <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(30), borderBottomWidth:2,borderColor:'#ccc', flexDirection:'row',alignItems:'center'}}>
              <Image style={{height:50,width:50,marginLeft:15}} source={require('../../assets/images/homepage-con.png')} />
              <View style={{marginLeft:10,height:'70%',justifyContent:'space-between'}}>
              <Text style={{fontWeight:'bold',fontSize:responsiveScreenFontSize(2),color:'#333'}}>{'Prescription (Dr sumit kumar)'}</Text>
              <Text>{'Order on 22 May 2024'}</Text>
              <View style={{backgroundColor:'#e3f6da',width:responsiveScreenWidth(42),justifyContent:'center',alignItems:'center',height:responsiveScreenWidth(6),borderRadius:10}}>
              <Text style={{}}>{'Out for Delivery'}</Text>
              </View>
              </View>
            </View>
          }
        />
    </View>
  )
}