import { View,ScrollView, Text, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth,responsiveScreenFontSize } from 'react-native-responsive-dimensions'

import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
import { router } from 'expo-router';
import { _retrieveData,_storeData } from '../local_storage';
import { path } from '../components/server';
export default function Checkout() {
  const [data, setData] = useState(null)
  const [items, setItems] = useState(null);
  const [pdata, setpdata] = useState(null);
  const [status, setStatus] = useState(null);
  const [address, setaddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setid] = useState(null);
  const [fulladd, setfulladd] = useState(null);
  const [discount, setdiscount] = useState(0);
  const [total, settotal] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [pin, setpin] = useState(null);
     const [recipt, setrecipt] = useState(null);
     const [num, setnum] = useState();
  useEffect(() => {

    _retrieveData("MED").then((mdata) => {
      console.log(mdata);
      if (mdata && mdata !== 'error') {
        setItems(mdata.medicine)
        setpdata(mdata.pdata)
        setaddress(mdata.address)
        setid(mdata.id)
        setdiscount(mdata.discount?mdata.discount:0)
     //    settotal(mdata.total)
      } else {
        Alert.alert('Error', 'user not found!')
      }
    });
  }, [])
  useEffect(() => {
    _retrieveData("USER_DATA").then((udata) => {
      if (udata && udata !== 'error') {
        setData(udata)
        console.log(udata)
      } else {
        Alert.alert('Error', 'user not found!')
      }
    });
  }, [])


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

 const handelPlaceOrder = async () => {
     const m_data = items.filter(item => item.qty === 1);
  setLoading(true)
  const t = getTotalPrice() - discount;
  const fd = new FormData();
  fd.append("case", "order")
  fd.append("mobile", data?.mobile)
  fd.append("order_details", JSON.stringify(m_data))
  fd.append("prescription_id", id)
  fd.append("address",address )
  fd.append("discount",discount )
  fd.append("amount",t )
  fd.append("pdata",JSON.stringify(pdata) )
  console.log(fd)

  try {
    const req = await fetch(path + "order.php", {
      body: fd,
      method: 'POST'
    })
    const res = await req.json();
    console.log(res)
    if(res.error){
      Alert.alert('Error ',res.message)
    }else{
      router.replace({ pathname: `/orderconfirm`, params: { data:getTotalPrice() - discount }})
    }
    setLoading(false)
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }


 }






  const increaseQuantity = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };

  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + Number(item.price?item.price:0) * item.qty, 0);
  };

  const decreaseQuantity = (id) => {
    setItems(items.map(item => {
         if (item.id === id) {
              if (item.qty > 1) {
                   return { ...item, qty: item.qty - 1 };
              } else {
                   return null;
              }
         }
         return item;
    }).filter(item => item !== null));
};

const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
};
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderAB title={'Checkout'} />
      <View style={{ height: responsiveScreenHeight(78) }}>
        <FlatList
          data={items}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>

            <View style={{ width: '95%', alignSelf: 'center', height: responsiveScreenWidth(22), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
            {item.image ? (
                      <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={{uri:item.image}} />
                ) : (
                     <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={require('../assets/images/noprevew.png')} />
                )}
             <View style={{ marginLeft: 10, height: '70%', justifyContent: 'space-between', width: '40%', marginRight: 15 }}>
                <Text numberOfLines={1} style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2), color: '#333' }}>{item.name}</Text>
                <Text numberOfLines={1} style={{ fontFamily: 'novaregular' }}>{item.desc}</Text>
                {item.status == "available"? <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: '#333' }}>{"₹ "+Number(item.price)}</Text>:<Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: 'red' }}>{"Not Available"}</Text>}
                {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), flexDirection: 'row', }}>

                     <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{"₹ " + item.price}</Text>
                     <Text style={{ fontFamily: 'novaregular', color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{"₹ " + item.original_price}</Text>
                     <Text style={{ color: 'green', marginLeft: 10, fontFamily: 'novaregular' }}>{item.offer}</Text>
                </View> */}

           </View>
           <View style={{ width: '30%', height: '55%', borderWidth: 1.5, borderColor:item.status == "available"? '#367F52':'#ccc', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
              
                     <AntDesign onPress={() =>{item.status == "available"?item.qty>1 ?  decreaseQuantity(item.id):ToastAndroid.show('You have to select atleast 1 quantity .', ToastAndroid.SHORT):null}} size={responsiveFontSize(2.5)} name="minus" color={item.status == "available"? '#367F52':'#ccc'} />
                
                
                

                <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color:item.status == "available"?'#333':'#ccc'  }}>{item.qty}</Text>
                <AntDesign onPress={() =>{item.status == "available"? increaseQuantity(item.id):null} } size={responsiveFontSize(2.5)} name="plus" color={item.status == "available"? '#367F52':'#ccc'} />
           </View>
      </View>
          }
          ListFooterComponent={() =>
            <View>
              <View style={{ borderTopWidth: 5, borderColor: '#ccc', marginTop: 20, borderBottomWidth: 5, paddingBottom: 2 }}>
                <View style={{ width: '90%', alignSelf: 'center' }}>
                  <Text style={{ borderBottomWidth: 1, borderColor: '#ccc', lineHeight: responsiveScreenWidth(15), fontSize: responsiveFontSize(2.2), fontFamily: 'novabold' }}>Bill summary</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Item total'}</Text>
                    {items && <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>₹ {getTotalPrice().toFixed(2)}</Text>}
                    {/* {items && <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>₹ {'160'}</Text>} */}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Shipping fee'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'free'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Total Discount'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'- ₹'+ discount}</Text>
                    {/* <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'- ₹'+ Number(40)}</Text> */}
                  </View>
                  <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>Bill total</Text>
                    {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>₹  {(getTotalPrice()-discount).toFixed(2)}</Text>}
                    {/* {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>₹ {Number(160) - Number(40)}</Text>} */}
                  </View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                    <Text style={{ color: '#555', fontSize: responsiveFontSize(2) }}>{'Address'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontWeight: 'bold' }}>{address}</Text>
                  </TouchableOpacity>
                </View>

              </View>
              <View style={{ borderTopWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), alignSelf: 'center', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }}>

                <Text style={{ color: '#555', fontSize: responsiveFontSize(2.2) }}>Payment Mode</Text>
                <Text style={{ color: '#555', fontSize: responsiveFontSize(2), }}>{'Cash On Delivery  '}<AntDesign size={responsiveFontSize(2)} name="down" color={'#367F52'} /></Text>
              </View>
            </View>
          }
        />
      </View>
      <View style={{ height: responsiveScreenHeight(10), width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ddd',position:'absolute',bottom:0 }}>
        {items &&<Text style={{ fontFamily:'novabold', fontSize: responsiveFontSize(3), }}>₹ {(getTotalPrice()-discount).toFixed(2)}</Text>}

        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor:items && (getTotalPrice()-discount) > 0 ? Colors.primary:'#ccc',
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            width: '40%'
          }}
          onPress={()=>{
               if(items &&(getTotalPrice()-discount)>0){
                    handelPlaceOrder()
               }else{

               }
          }}
        >

          <Text
            style={{ fontFamily:'novabold', fontSize: responsiveFontSize(2.3), color: Colors.backgroundcolor }}
          >
            Checkout
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