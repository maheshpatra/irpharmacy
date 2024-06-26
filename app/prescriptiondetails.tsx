import { View, Text, FlatList, Image, TouchableOpacity, Modal, Alert, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Entypo from '@expo/vector-icons/Entypo';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
import { ScrollView } from 'react-native-gesture-handler';
import { router, useLocalSearchParams } from 'expo-router';
import { path } from '../components/server';
import { _retrieveData, _storeData } from '../local_storage';
import { MaterialIcons } from '@expo/vector-icons';
export default function PrepscriptionDetails() {


     const [modalVisible, setModalVisible] = useState(false);
     const [address, setaddress] = useState(null);
     const { data } = useLocalSearchParams();
     const [addresstype, setaddresstype] = useState('Home');
     const [pdata, setpdata] = useState(null);
     const [status, setStatus] = useState(null);
     const [discount, setDiscount] = useState(0);
     const [image, setimage] = useState(null);
     const [pin, setpin] = useState(null);
     const [fulladd, setfulladd] = useState(null);
     const [recipt, setrecipt] = useState(null);
     const [num, setnum] = useState();


     const [items, setItems] = useState(null);
     const [loading, setLoading] = useState(false);

     const saveaddress = () => {
          if (!pin) {
               Alert.alert('Opps', 'please enter a valid details')
               return
          } else if (!fulladd) {
               Alert.alert('Opps', 'please enter a valid details')
               return
          } else if (!fulladd) {
               Alert.alert('Opps', 'please enter a valid details')
               return
          }
          const KEY = 'ADDRESS'
          var mydata = new Object({ pin: pin, fulladd: fulladd, type: addresstype })
          console.log(mydata)
          _storeData(KEY, mydata)
               .then(m => {
                    if (m === "saved") {
                         setModalVisible(false)
                         setaddress(fulladd + pin + addresstype)
                    }
               })
               .catch(err => console.log(err));
     }
     useEffect(() => {

          _retrieveData("ADDRESS").then((userdata) => {
               console.log(userdata);
               if (userdata && userdata !== 'error') {
                    setaddress(userdata.fulladd + ' ' + userdata.pin + ' ' + userdata.type)

               } else {
                    //    Alert.alert('Error','user not found!')

               }

          });
     }, [])






     const gotocheckout = () => {
          console.log()
          const KEY = 'MED'
          const m_data = items.filter(item => item.qty === 1);
          // console.log(m_data)
          var mydata = new Object({ medicine: m_data, pdata: pdata[0], address: address, id: data, discount: discount, total: Number(getTotalPrice().toFixed(2) - discount) })
          _storeData(KEY, mydata)
               .then(v => {
                    if (v === "saved") {
                         setLoading(false)
                         router.replace('/checkout')
                    }
               })
               .catch(err => console.log(err));
     }

     const getprescription = async () => {
          setLoading(true)
          const fd = new FormData();
          fd.append("id", data)
          fd.append("case", 'get_prescriptions_byid')
          try {
               const req = await fetch(path + "prescription.php", {
                    body: fd,
                    method: 'post'
               })
               const res = await req.json();
               console.log(res)

               setItems(JSON.parse(res.data.medicine_data))
               setpdata(JSON.parse(res.data.patient_details))
               setStatus(res.data.type)
               setDiscount(res.data.discount)
               setimage(res.data.image)
               setLoading(false)
          } catch (err) {
               console.log(JSON.stringify(err, null, 2));
          }
     }

     useEffect(() => {
          getprescription()
     }, [data])



     

     const handleCheck = (id) => {
          setItems(items.map(item => item.id === id ? { ...item, qty: item.qty === 1 ? 0 : 1 } : item));
     };

    

     const deleteItem = (id) => {
          setItems(items.filter(item => item.id !== id));
     };
     const getTotalPrice = () => {
          return items.reduce((total, item) => total + item.price * item.quantity, 1);
     };

     function percentage(percent, total) {
          return ((percent / 100) * total).toFixed(2)
     }
     return (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
               <HeaderAB title={'Prescription Details'} />
               {status && <Text style={{ alignSelf: 'center', color: 'green', fontFamily: 'novabold' }}>{status}</Text>}
               <View style={{ height: responsiveScreenHeight(68) }}>
                    <FlatList
                         data={items}
                         showsVerticalScrollIndicator={false}
                         ListHeaderComponent={() =>
                              <View>
                                   <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
                                        {pdata && <Image resizeMode='cover' style={{ height: responsiveScreenWidth(15), width: responsiveScreenWidth(15), borderRadius: 40 }} source={pdata[0].gender == 'Female' ? require('../assets/images/female.jpg') : require('../assets/images/male.jpg')} />}
                                        {pdata && <View style={{ marginLeft: 25, width: '70%', }}>
                                             <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333', }}>{pdata[0].name}</Text>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), color: '#333', }}>{pdata[0].gender + " , " + pdata[0].age + " Years"} </Text>

                                        </View>}

                                   </View>

                                   {image && <Image resizeMode='stretch' source={{ uri: image }} style={{ backgroundColor: '#ccc', height: responsiveScreenWidth(51), width: responsiveScreenWidth(45), alignSelf: 'center', marginVertical: responsiveScreenWidth(5) }} />}
                              </View>

                         }
                         renderItem={({ item, index }) =>

                              <View style={{ width: '95%', alignSelf: 'center', height: responsiveScreenWidth(22), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                   {item.image ? (
                                        <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={{ uri: item.image }} />
                                   ) : (
                                        <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={require('../assets/images/noprevew.png')} />
                                   )}
                                   <View style={{ marginLeft: 10, height: '50%', justifyContent: 'space-between', width: '45%', marginRight: 15 }}>
                                        <Text numberOfLines={1} style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2), color: '#333' }}>{item.name}</Text>
                                        <Text numberOfLines={1} style={{ fontFamily: 'novaregular' }}>{item.desc}</Text>
                                        {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), flexDirection: 'row', }}>

                                             <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{"₹ " + item.price}</Text>
                                             <Text style={{ fontFamily: 'novaregular', color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{"₹ " + item.original_price}</Text>
                                             <Text style={{ color: 'green', marginLeft: 10, fontFamily: 'novaregular' }}>{item.offer}</Text>
                                        </View> */}

                                   </View>
                                   <View style={{ width: '15%', height: '45%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10 }}>
                                   {item.qty === 0 ? (<MaterialIcons
                                             onPress={() => handleCheck(item.id)}
                                             size={responsiveFontSize(3.5)} name="check-box-outline-blank" color={'#367F52'} />)
                                             :
                                             (<MaterialIcons
                                                  onPress={() => handleCheck(item.id)}
                                                  size={responsiveFontSize(3.5)} name="check-box" color={'#367F52'} />)
                                             
                                             }
                                   </View>
                                   {/* <View style={{ width: '30%', height: '55%', borderWidth: 1.5, borderColor: '#367F52', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                                        {item.qty > 1 ? (
                                             <AntDesign onPress={() => decreaseQuantity(item.id)} size={responsiveFontSize(2.5)} name="minus" color={'#367F52'} />
                                        ) : (
                                             <AntDesign onPress={() => decreaseQuantity(item.id)} size={responsiveFontSize(2.5)} name="delete" color={'#367F52'} />
                                        )}
                                        
                                        

                                        <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color: '#333' }}>{item.qty}</Text>
                                        <AntDesign onPress={() => increaseQuantity(item.id)} size={responsiveFontSize(2.5)} name="plus" color={'#367F52'} />
                                   </View> */}
                              </View>
                         }
                         ListFooterComponent={() =>
                              <View>
                                   <View style={{ borderTopWidth: 5, borderColor: '#ccc', marginTop: 20, borderBottomWidth: 5, paddingBottom: 2 }}>
                                        <View style={{ width: '90%', alignSelf: 'center' }}>
                                             {/* <Text style={{ borderBottomWidth: 1, borderColor: '#ccc', lineHeight: responsiveScreenWidth(15), fontSize: responsiveFontSize(2.2), fontFamily: 'novabold' }}>Bill summary</Text> */}

                                             {/* <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Item total'}</Text>
                                                  {items && <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>₹ {getTotalPrice().toFixed(2)}</Text>}
                                             </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Shipping fee'}</Text>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'free'}</Text>
                                             </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Total Discount'}</Text>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{discount}</Text>
                                             </View>
                                             <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                                  <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>Bill total</Text>
                                                  {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>₹ {Number(getTotalPrice().toFixed(2)) - discount}</Text>}
                                             </View> */}
                                             {address ? <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                                                  <Text style={{ color: '#555', fontSize: responsiveFontSize(2), fontFamily: 'novaregular' }}>{'Address'}</Text>
                                                  <Text numberOfLines={1} style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novabold', width: '60%', textAlign: 'right' }}>{address}</Text>
                                             </View> : <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                                             </View>}
                                        </View>

                                   </View>
                                   <View style={{ borderTopWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                                        <Text style={{ color: '#333', fontSize: responsiveFontSize(2.2), fontFamily: 'novabold' }}><Entypo size={responsiveFontSize(3)} name="location-pin" color={'#367F52'} /> Address</Text>
                                        <Text onPress={() => setModalVisible(true)} style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novabold' }}>{'Add New Address'}</Text>
                                   </View>
                              </View>
                         }
                    />
               </View>
               <View style={{ height: responsiveScreenHeight(12), width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ddd' }}>
                    {/* {items && <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(3), }}>₹ {getTotalPrice().toFixed(2) - discount}</Text>} */}
                    <View />
                    <TouchableOpacity
                         style={{
                              height: 50,
                              backgroundColor: Colors.primary,
                              alignItems: "center",
                              justifyContent: "center",

                              borderRadius: 6,
                              width: '40%'
                         }}
                         onPress={() => {
                              address ? gotocheckout() :
                                   Alert.alert('Add Address', 'Please add your address first')
                         }}
                    >

                         <Text
                              style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color: Colors.backgroundcolor }}
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
                              <View style={{ height: '85%' }}>
                                   <ScrollView>
                                        <View style={{ borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(15), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>

                                             <Text style={{ color: '#555', fontFamily: 'novabold', marginLeft: 20, fontSize: responsiveFontSize(2.3) }}>Add Address Details</Text>
                                             <AntDesign onPress={() => setModalVisible(false)} style={{ marginRight: 20, padding: 5 }} size={responsiveScreenFontSize(2.3)} name="close" color={'#555'} />
                                        </View>
                                        {/* <View style={{ marginVertical: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(10), }}>
                                        <Entypo size={responsiveFontSize(3)} name="location-pin" color={'#333'} />
                                        <View style={{ marginLeft: 25, width: '70%', }}>
                                             <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333', }}>Makal hati mouza</Text>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), color: '#333', }}>Maheshtal </Text>
                                        </View>
                                   </View> */}
                                        <View style={{ marginTop: 0, borderTopWidth: 1, borderColor: '#ccc', width: '100%', paddingTop: 15 }}>
                                             <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginBottom: 20 }}>
                                                  <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Pincode* </Text>
                                                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                                                       <TextInput value={pin} onChangeText={(txt) => setpin(txt)} style={{ width: '50%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular' }} />
                                                       {/* <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2.), marginLeft: 10 }}>Kolkata-West Bengal </Text> */}
                                                  </View>
                                             </View>
                                             <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginTop: responsiveScreenWidth(5) }}>
                                                  <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>House number,floor,building name,locality* </Text>
                                                  <TextInput value={fulladd} onChangeText={(txt) => setfulladd(txt)} style={{ width: '100%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular', marginTop: 5 }} />
                                             </View>
                                             <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginTop: responsiveScreenWidth(5) }}>
                                                  <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Recipient's name* </Text>
                                                  <TextInput value={recipt} onChange={(txt) => setrecipt(txt)} style={{ width: '100%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular', marginTop: 5 }} />
                                             </View>
                                             <View style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(15), marginTop: responsiveScreenWidth(5) }}>
                                                  <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), }}>Phone Number* </Text>
                                                  <TextInput value={num} onChange={(t) => setnum(t)} style={{ width: '100%', borderRadius: 6, borderColor: '#ccc', borderWidth: 1, height: responsiveScreenWidth(12), paddingLeft: 10, color: '#333', fontFamily: 'novaregular', marginTop: 5 }} />
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
                                   alignSelf: 'center', bottom: 10, position: 'absolute'
                              }}
                              onPress={saveaddress}
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