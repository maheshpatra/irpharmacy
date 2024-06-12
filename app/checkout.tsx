import { View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'

import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
import { router } from 'expo-router';
import { _retrieveData } from '../local_storage';
import { path } from '../components/server';
export default function Checkout() {
  const [data, setData] = useState(null)
  const [items, setItems] = useState(null);
  const [pdata, setpdata] = useState(null);
  const [status, setStatus] = useState(null);
  const [address, setaddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [id, setid] = useState(null);
  const [discount, setdiscount] = useState(0);
  const [total, settotal] = useState(0);
  useEffect(() => {

    _retrieveData("MED").then((mdata) => {
      console.log(mdata);
      if (mdata && mdata !== 'error') {
        setItems(mdata.medicine)
        setpdata(mdata.pdata)
        setaddress(mdata.address)
        setid(mdata.id)
        setdiscount(mdata.discount)
        settotal(mdata.total)
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

 const handelPlaceOrder = async () => {
  setLoading(true)
  const t = Number(getTotalPrice().toFixed(2)) - discount;
  const fd = new FormData();
  fd.append("case", "order")
  fd.append("mobile", data?.mobile)
  fd.append("order_details", JSON.stringify(items))
  fd.append("prescription_id", id)
  fd.append("address",address )
  fd.append("amount",t )
  fd.append("pdata",JSON.stringify(pdata) )
  // console.log(fd)

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
      router.replace({ pathname: `/orderconfirm`, params: { data:Number(getTotalPrice().toFixed(2)) - discount }})
    }
    setLoading(false)
  } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  }


 }






  const increaseQuantity = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  };

  
  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 1);
  };

  const decreaseQuantity = (id) => {
    setItems(items.map(item => {
         if (item.id === id) {
              if (item.quantity > 1) {
                   return { ...item, quantity: item.quantity - 1 };
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
      <View style={{ height: responsiveScreenHeight(68) }}>
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
                <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), flexDirection: 'row', }}>

                     <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{"₹ " + item.price}</Text>
                     <Text style={{ fontFamily: 'novaregular', color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{"₹ " + item.original_price}</Text>
                     <Text style={{ color: 'green', marginLeft: 10, fontFamily: 'novaregular' }}>{item.offer}</Text>
                </View>

           </View>
           <View style={{ width: '30%', height: '55%', borderWidth: 1.5, borderColor: '#367F52', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                {item.quantity > 1 ? (
                     <AntDesign onPress={() => decreaseQuantity(item.id)} size={responsiveFontSize(2.5)} name="minus" color={'#367F52'} />
                ) : (
                     <AntDesign onPress={() => deleteItem(item.id)} size={responsiveFontSize(2.5)} name="delete" color={'#367F52'} />
                )}
                
                

                <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color: '#333' }}>{item.quantity}</Text>
                <AntDesign onPress={() => increaseQuantity(item.id)} size={responsiveFontSize(2.5)} name="plus" color={'#367F52'} />
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
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Shipping fee'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'free'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Total Discount'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'- ₹'+ discount}</Text>
                  </View>
                  <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>Bill total</Text>
                    {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>₹ {Number(getTotalPrice().toFixed(2)) - discount}</Text>}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: responsiveScreenWidth(12) }}>
                    <Text style={{ color: '#555', fontSize: responsiveFontSize(2) }}>{'Address'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontWeight: 'bold' }}>{address}</Text>
                  </View>
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
      <View style={{ height: responsiveScreenHeight(14), width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ddd' }}>
        {items &&<Text style={{ fontFamily:'novabold', fontSize: responsiveFontSize(3), }}>₹ {Number(getTotalPrice().toFixed(2)) - discount}</Text>}

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
          onPress={handelPlaceOrder}
        >

          <Text
            style={{ fontFamily:'novabold', fontSize: responsiveFontSize(2.3), color: Colors.backgroundcolor }}
          >
            Checkout
          </Text>
          {/* )} */}
        </TouchableOpacity>



      </View>
    </View>
  )
}