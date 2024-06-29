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
import { _storeData } from '../local_storage';
export default function OrderDetails() {


     const [modalVisible, setModalVisible] = useState(false);
     const [address, setaddress] = useState(null);
     const {data} = useLocalSearchParams();
     const [addresstype, setaddresstype] = useState('Home');
     const [pdata, setpdata] = useState(null);
     const [status, setStatus] = useState(null);
     const [discount, setDiscount] = useState(0);
     const [image, setimage] = useState(null);
     
    
        const [items, setItems] = useState(null);
        const [loading, setLoading] = useState(false);
        const [mydata, setMydata] = useState(null);
       
       
      
     
    const getorder = async () => {
     setLoading(true)
     const fd = new FormData();
     fd.append("id", data)
     fd.append("case", 'get_order_byid')
     try {
       const req = await fetch(path + "order.php", {
         body: fd,
         method: 'post'
       })
       const res = await req.json();
       console.log(res)
       
       setItems(JSON.parse(res.data.order_details))
       setpdata(JSON.parse(res.data.p_data))
       setStatus(res.data.status)
       setDiscount(res.data.discount)
       setaddress(res.data.address)
       setMydata(res.data)

       setLoading(false)
     } catch (err) {
       console.log(JSON.stringify(err, null, 2));
     }
   }
 
   useEffect(()=>{
     getorder()
   },[data])



  const increaseQuantity = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  const decreaseQuantity = (id) => {
    setItems(items.map(item => item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item));
  };
  const getTotalPrice = () => {
     return items.reduce((total, item) => total + Number(item.price?item.price:0) * item.qty, 0);
   };

   function percentage(percent, total) {
     return ((percent/ 100) * total).toFixed(2)
 }
     return (
          <View style={{ flex: 1, backgroundColor: '#fff' }}>
               <HeaderAB title={'Order Details'} />
               {status &&<Text style={{ alignSelf: 'center', color: 'green', fontFamily: 'novabold' }}>{status} Order</Text>}
               <View style={{ height: responsiveScreenHeight(80) }}>
                    <FlatList
                         data={items}
                         showsVerticalScrollIndicator={false}
                         ListHeaderComponent={() =>
                              <View>
                                   <View style={{ marginTop: 15, width: '90%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', height: responsiveScreenWidth(12) }}>
                                        {pdata && <Image resizeMode='cover' style={{ height: responsiveScreenWidth(15), width: responsiveScreenWidth(15), borderRadius: 40 }} source={pdata.gender == 'Female' ? require('../assets/images/female.jpg') : require('../assets/images/male.jpg')} />}
                                        {pdata && <View style={{ marginLeft: 25, width: '70%', }}>
                                             <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333', }}>{pdata.name}</Text>
                                             <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), color: '#333', }}>{pdata.gender + " , " + pdata.age + " Years"} </Text>

                                        </View>}

                                   </View>

                                   {image && <Image resizeMode='stretch' source={{ uri: image }} style={{ backgroundColor: '#ccc', height: responsiveScreenWidth(51), width: responsiveScreenWidth(45), alignSelf: 'center', marginVertical: responsiveScreenWidth(5) }} />}
                              </View>

                         }
                         renderItem={({item,index}) =>

                              <View style={{ width: '95%', alignSelf: 'center', height: responsiveScreenWidth(22), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                                   <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={require('../assets/images/noprevew.png')} />
                                   <View style={{ marginLeft: 10, height: '70%', justifyContent: 'space-between', width: '40%', marginRight: 15 }}>
                                        <Text numberOfLines={1} style={{fontFamily:'novabold', fontSize: responsiveFontSize(2), color: '#333' }}>{item.name}</Text>
                                        <Text numberOfLines={1} style={{fontFamily:'novaregular'}}>{item.desc}</Text>
                                       

                                             <Text style={{ fontFamily:'novabold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{"₹ "+item.price}</Text>
                                             {/* <Text style={{fontFamily:'novaregular', color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{"₹ "+item.original_price}</Text> */}
                                           
                                        

                                   </View>
                                   <View style={{ width: '20%', height: '55%', borderWidth: 1.5, borderColor: '#367F52', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 10,}}>
                                        {/* <AntDesign  size={responsiveFontSize(2.5)} name="minus" color={'#367F52'} /> */}
                                        <Text style={{ fontFamily:'novabold', fontSize: responsiveFontSize(2.3), color: '#333' }}>{item.qty}</Text>
                                        {/* <AntDesign  size={responsiveFontSize(2.5)} name="plus" color={'#367F52'} /> */}
                                   </View>
                              </View>
                         }
                         ListFooterComponent={() =>
                              <View>
                                   <View style={{ borderTopWidth: 2, borderColor: '#ddd', marginTop: 20, paddingBottom: 2 }}>
                                        <View style={{ width: '90%', alignSelf: 'center' }}>
                                             <Text style={{ borderBottomWidth: 1, borderColor: '#ccc', lineHeight: responsiveScreenWidth(15), fontSize: responsiveFontSize(2.2),fontFamily:'novabold' }}>Bill summary</Text>

                                             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>{'Item total'}</Text>
                                                  {items &&<Text style={{ color: 'green', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>₹ {Number(getTotalPrice()).toFixed(2)}</Text>}
                                             </View>
                                             <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>{'Shipping fee'}</Text>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>{'free'}</Text>
                                             </View>
                                           {items&&  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>{'Total Discount'}</Text>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>{ mydata?.discount }</Text>
                                             </View>}
                                             <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                                                  <Text style={{ fontSize: responsiveFontSize(2.2),fontFamily:'novabold', }}>Bill total</Text>
                                                 {items && <Text style={{ fontSize: responsiveFontSize(2.2),fontFamily:'novabold', }}>₹ {mydata?.amount}</Text>}
                                             </View>
                                             {address &&<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                                                  <Text style={{ color: '#555', fontSize: responsiveFontSize(2),fontFamily:'novaregular', }}>{'Address'}</Text>
                                                  <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily:'novabold', }}>{address}</Text>
                                             </View> }
                                        </View>

                                   </View>
                                   
                              </View>
                         }
                    />
               </View>
               {/* <View style={{ height: responsiveScreenHeight(14), width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ddd' }}>
                    {items &&<Text style={{fontFamily:'novabold', fontSize: responsiveFontSize(3), }}>₹ {getTotalPrice().toFixed(2)-discount}</Text>}

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
               address?gotocheckout():
               Alert.alert('Add Address','Please add your address first')
              }}
                    >

                         <Text
                              style={{ fontFamily:'novabold', fontSize: responsiveFontSize(2.3), color: Colors.backgroundcolor }}
                         >
                              Proceed
                         </Text>
                         
                    </TouchableOpacity>



               </View>  */}
               
          </View>
     )
}