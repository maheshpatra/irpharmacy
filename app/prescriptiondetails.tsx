import { View, Text, FlatList, Image, TouchableOpacity, Modal, Alert, TextInput } from 'react-native'
import React, { useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import { router } from 'expo-router';
export default function PrepscriptionDetails() {


     const [modalVisible, setModalVisible] = useState(false);
     const [address, setaddress] = useState(null);
     const [addresstype, setaddresstype] = useState('Home');
     return (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
               <HeaderAB title={'Prescription Details'} />
               <Text style={{ alignSelf: 'center', color: 'green', fontFamily: 'novabold' }}>Digitalization Order</Text>
               <View style={{ height: responsiveScreenHeight(68) }}>
                    <FlatList
                         data={['1', '2', '3', '8', '9', '7']}
                         showsVerticalScrollIndicator={false}
                         ListHeaderComponent={() =>
                              <View>
                                   <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
                                        <Image resizeMode='cover' style={{ height: responsiveScreenWidth(15), width: responsiveScreenWidth(15), borderRadius: 40 }} source={require('../assets/images/female.jpg')} />
                                        <View style={{ marginLeft: 25, width: '70%', }}>
                                             <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333', }}>Aparna Sing</Text>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), color: '#333', }}>Female , 32 Years</Text>

                                        </View>

                                   </View>

                                   <Image resizeMode='stretch' source={require('../assets/images/uploadpresctipn.png')} style={{ backgroundColor: '#ccc', height: responsiveScreenWidth(51), width: responsiveScreenWidth(45), alignSelf: 'center', marginVertical: responsiveScreenWidth(5) }} />
                              </View>

                         }
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
                                             {address ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                                                  <Text style={{ color: '#555', fontSize: responsiveFontSize(2) }}>{'Address'}</Text>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontWeight: 'bold' }}>{'(Home Tamluk)-789211'}</Text>
                                             </View> : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                                             </View>}
                                        </View>

                                   </View>
                                   {!address && <View style={{ borderTopWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                                        <Text style={{ color: '#333', fontSize: responsiveFontSize(2.2), fontFamily: 'novabold' }}><Entypo size={responsiveFontSize(3)} name="location-pin" color={'#367F52'} /> Tamluk</Text>
                                        <Text onPress={() => setModalVisible(true)} style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novabold' }}>{'Add Address'}</Text>
                                   </View>}
                              </View>
                         }
                    />
               </View>
               <View style={{ height: responsiveScreenHeight(14), width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ddd' }}>
                    <Text style={{ fontWeight: 'bold', fontSize: responsiveFontSize(3), }}>{'₹ 160.00'}</Text>

                    <TouchableOpacity
                         style={{
                              height: 50,
                              backgroundColor: Colors.primary,
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 10,
                              borderRadius: 6,
                              width: '40%'
                         }}
              onPress={()=>{
               address?router.push('/checkout'):
               Alert.alert('Add Address','Please add your address first')
              }}
                    >

                         <Text
                              style={{ fontWeight: "bold", fontSize: responsiveFontSize(2), color: Colors.backgroundcolor }}
                         >
                              Proceed
                         </Text>
                         {/* )} */}
                    </TouchableOpacity>



               </View>
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                         Alert.alert('Modal has been closed.');
                         setModalVisible(!modalVisible);
                    }}>
                    <View style={{ flex: 1, backgroundColor: '#000', opacity: .9 }}>
                         <View style={{ position: 'absolute', bottom: 0, height: responsiveScreenHeight(70), backgroundColor: '#fff', width: '100%' }}>
                              <View style={{height:'85%'}}>
                              <ScrollView>
                                   <View style={{ borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(15), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>

                                        <Text style={{ color: '#555', fontFamily: 'novabold', marginLeft: 20, fontSize: responsiveFontSize(2.3) }}>Add Address Details</Text>
                                        <AntDesign onPress={() => setModalVisible(false)} style={{ marginRight: 20, padding: 5 }} size={responsiveScreenFontSize(2.3)} name="close" color={'#555'} />
                                   </View>
                                   <View style={{ marginVertical: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(10), }}>
                                        <Entypo size={responsiveFontSize(3)} name="location-pin" color={'#333'} />
                                        <View style={{ marginLeft: 25, width: '70%', }}>
                                             <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333', }}>Makal hati mouza</Text>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), color: '#333', }}>Maheshtal </Text>
                                        </View>
                                   </View>
                                   <View style={{ marginTop: 0, borderTopWidth: 1, borderColor: '#ccc', width: '100%', paddingTop: 15 }}>
                                        <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginBottom: 20 }}>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Pincode* </Text>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                  <TextInput style={{ width: '50%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular' }} />
                                                  <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2.), marginLeft: 10 }}>Kolkata-West Bengal </Text>
                                             </View>
                                        </View>
                                        <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginTop: responsiveScreenWidth(5) }}>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>House number,floor,building name,locality* </Text>
                                             <TextInput style={{ width: '100%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular', marginTop: 5 }} />
                                        </View>
                                        <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginTop: responsiveScreenWidth(5) }}>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Recipient's name* </Text>
                                             <TextInput style={{ width: '100%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular', marginTop: 5 }} />
                                        </View>
                                        <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginTop: responsiveScreenWidth(5) }}>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Phone Number* </Text>
                                             <TextInput style={{ width: '100%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular', marginTop: 5 }} />
                                        </View>
                                        <View style={{ width: '90%', alignSelf: 'center', marginTop: responsiveScreenWidth(5) }}>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Address Type* </Text>
                                             <FlatList
                                                  data={['Home', 'Office', 'Other']}
                                                  horizontal
                                                  renderItem={({ item }) =>
                                                       <TouchableOpacity onPress={() => setaddresstype(item)} style={{ height: 30, width: responsiveScreenWidth(20), borderRadius: 4, borderColor: addresstype == item ? '#000' : '#555', justifyContent: 'center', alignItems: 'center', borderWidth: 1, marginRight: 10, marginTop: 15 }}>
                                                            <Text style={{ color: addresstype == item ? '#000' : '#555', fontFamily: addresstype == item ? 'novabold' : 'novaregular' }}>{item}</Text>
                                                       </TouchableOpacity>
                                                  }

                                             />
                                        </View>

                                   </View>
                              </ScrollView>
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
                                   width: '70%',
                                   alignSelf:'center',bottom:10,position:'absolute'
                              }}
                           onPress={()=>{
                              setModalVisible(false)
                              setaddress('kolkata 897956')}}
                         >

                              <Text
                                   style={{ fontWeight: "bold", fontSize: responsiveFontSize(2), color: Colors.backgroundcolor }}
                              >
                                   Save Address
                              </Text>
                              {/* )} */}
                         </TouchableOpacity>
                    </View>
               </Modal>
          </View>
     )
}