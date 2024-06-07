import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'

import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
export default function Checkout() {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderAB title={'Checkout'} />
      <View style={{ height: responsiveScreenHeight(68) }}>
        <FlatList
          data={['1', '2', '3', '8', '9', '7']}
          showsVerticalScrollIndicator={false}
          renderItem={() =>

            <View style={{ width: '95%', alignSelf: 'center', height: responsiveScreenWidth(22), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
              <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={require('../assets/images/homepage-con.png')} />
              <View style={{ marginLeft: 10, height: '70%', justifyContent: 'space-between', width: '40%', marginRight: 15 }}>
                <Text numberOfLines={1} style={{ fontWeight: 'bold', fontSize: responsiveFontSize(2), color: '#333' }}>{' Ecosprin 75 Tablet'}</Text>
                <Text numberOfLines={1}>{'Strip of 14 tablets'}</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), flexDirection: 'row', }}>

                  <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{'₹ 15'}</Text>
                  <Text style={{ color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{'₹ 16.47'}</Text>
                  <Text style={{ color: 'green', marginLeft: 10 }}>{'10 % off'}</Text>
                </View>

              </View>
              <View style={{ width: '30%', height: '55%', borderWidth: 1.5, borderColor: '#367F52', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <AntDesign size={responsiveFontSize(2.2)} name="minus" color={'#367F52'} />
                <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(2), color: '#333' }}>{'1'}</Text>
                <AntDesign size={responsiveFontSize(2.2)} name="plus" color={'#367F52'} />
              </View>
            </View>
          }
          ListFooterComponent={() =>
            <View>
              <View style={{ borderTopWidth: 5, borderColor: '#ccc', marginTop: 20, borderBottomWidth: 5, paddingBottom: 2 }}>
                <View style={{ width: '90%', alignSelf: 'center' }}>
                  <Text style={{ borderBottomWidth: 1, borderColor: '#ccc', lineHeight: responsiveScreenWidth(15), fontWeight: 'bold', fontSize: responsiveFontSize(2.2) }}>Bill summary</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>{'Item total'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>{'₹ 100'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>{'Shipping fee'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>{'free'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>{'Total Discount'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>{'- ₹40'}</Text>
                  </View>
                  <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(2.2) }}>Bill total</Text>
                    <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(2.2), }}>{'₹ 160.00'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                    <Text style={{ color: '#555', fontSize: responsiveFontSize(2) }}>{'Address'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontWeight: 'bold' }}>{'(Home Tamluk)-789211'}</Text>
                  </View>
                </View>

              </View>
              <View style={{ borderTopWidth: 1,  borderColor: '#ccc', height: responsiveScreenWidth(12), alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                <Text style={{ color: '#555', fontSize: responsiveFontSize(2.2) }}>Payment Mode</Text>
                <Text style={{ color: '#555', fontSize: responsiveFontSize(2), }}>{'Cash On Delivery  '}<AntDesign size={responsiveFontSize(2)} name="down" color={'#367F52'} /></Text>
              </View>
            </View>
          }
        />
      </View>
      <View style={{ height: responsiveScreenHeight(14), width: '100%', flexDirection: 'row', alignItems: 'center',paddingHorizontal:15,justifyContent:'space-between',borderTopWidth:1,borderColor:'#ddd' }}>
      <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(3), }}>{'₹ 160.00'}</Text>

      <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 6,
              width:'40%'
            }}
           
          >
           
            <Text
              style={{ fontWeight: "bold", fontSize: responsiveFontSize(2), color: Colors.backgroundcolor }}
            >
              Checkout
            </Text>
            {/* )} */}
          </TouchableOpacity>



      </View>
    </View>
  )
}