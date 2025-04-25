import { View, ScrollView, Text, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth, responsiveScreenFontSize } from 'react-native-responsive-dimensions'
import RazorpayCheckout from 'react-native-razorpay';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { _retrieveData, _storeData } from '../local_storage';
import { path } from '../components/server';
export default function Checkout() {
  const params = useLocalSearchParams()
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
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const selectedAddres = params
  const [recipt, setrecipt] = useState(null);
  const [num, setnum] = useState();
  useEffect(() => {

    _retrieveData("MED").then((mdata) => {
      console.log(mdata);
      if (mdata && mdata !== 'error') {
        setItems(mdata.medicine)
        setpdata(mdata.pdata)
        setaddress(mdata.address)
        setid(mdata.pid)
        console.log(mdata.pid)
        setdiscount(mdata.discount ? mdata.discount : 0)
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


  const handelrpay = async () => {
    const amount = getTotalPrice() - discount;
    if (amount <= 0) {
      Alert.alert('Payment Warning', 'Amount must be greater than zero');
      return;
    }

    const options = {
      description: 'Order Payment',
      image: 'https://www.irhealthcareservice.com/assets/images/logo/websitelogo.png',
      currency: 'INR',
      key: 'rzp_live_gCiUxU1aEWHn6Z',
      amount: amount * 100,
      name: 'IR Pharmacy',
      prefill: {
        email: data?.email || 'test@example.com',
        contact: data?.mobile,
        name: data?.name || 'Customer'
      },
      theme: { color: Colors.primary }
    };

    RazorpayCheckout.open(options).then((paymentData) => {
      // handle success
      console.log(paymentData);
      placeOnlineOrder(paymentData);
    }).catch((error) => {
      Alert.alert('Payment Failed', 'Cancelled By User.');
    });
  };

  const handelPlaceOrder = async () => {
    const t = (getTotalPrice()) - discount;
    if (t > 0 && paymentMethod === 'cod') {

      const m_data = items.filter(item => item.qty >= 1);
      setLoading(true)
      const fd = new FormData();
      fd.append("case", "order");
      fd.append("mobile", data?.mobile);
      fd.append("order_details", JSON.stringify(m_data));
      fd.append("prescription_id", id);
      fd.append("address", address);
      fd.append("discount", getTotalDiscount());
      fd.append("amount", getTotalPrice())
      fd.append("pdata", JSON.stringify(pdata));
      fd.append("payment_method", 'cod');
      fd.append("payment_id", '');
      fd.append("pharld", ''); // pharmacy ID, required in DB
      fd.append("buyer_id", data?.userid); // logged in user id
      fd.append("drname", ''); // optional, doctor's name if any
      fd.append("paymentmode", 'cash'); // or 'qr', etc.
      fd.append("cashgiven", 0); // amount of cash customer gave
      fd.append("cashreturn", 0); // change returned
      fd.append("qrpayment", 0); // QR payment amount


      
        const req = await fetch("https://irhealthcareservice.com/app_api/order.php", {
          body: fd,
          method: 'POST'
        })
        const ress = req.json();
        console.log(fd)
        setLoading(false)
        if (ress.error) {
          Alert.alert('Error ', res.message)
        } else {
          router.replace({ pathname: `/orderconfirm`, params: { data: getTotalPrice() - discount } })
        }

     


    } else {
      handelrpay()
    }
    setLoading(false)
  }

  const checkStock = async (selectedItems, pincode) => {
    const sit = selectedItems.map(item => item.id)
    console.log(sit)
    try {
      const response = await fetch('https://irhealthcareservice.com/app_api/check_stock.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          selectedItems: selectedItems.map(item => item.id),
          pincode: pincode,
        }),
      });

      const data = await response.json();
      console.log(data)
      // if (Array.isArray(data)) {
      //   const updatedItems = selectedItems.map(item => {
      //     const found = data.find(d => d.id === item.id);
      //     if (found) {
      //       return {
      //         ...item,
      //         status: found.available ? 'available' : 'notavailable',
      //         pharID: found.pharID || null,
      //       };
      //     }
      //     return item;
      //   });

      //   return updatedItems;
      // } else {
      //   console.error('Error in response:', data);
      //   return selectedItems;
      // }
    } catch (error) {
      console.error('checkStock error:', error);
      return selectedItems;
    }
  };


  const placeOnlineOrder = async (paymentData) => {
    const amount = (getTotalPrice()) - discount;
    const m_data = items.filter(item => item.qty >= 1);
    setLoading(true);

    const fd = new FormData();
    fd.append("case", "order")
    fd.append("mobile", data?.mobile)
    fd.append("order_details", JSON.stringify(m_data))
    fd.append("prescription_id", id)
    fd.append("address", selectedAddress)
    fd.append("discount", discount)
    fd.append("amount", amount)
    fd.append("pdata", JSON.stringify(pdata))
    fd.append("payment_method", "online");
    fd.append("payment_id", paymentData.razorpay_payment_id);

    try {
      const req = await fetch(path + "order.php", {
        body: fd,
        method: 'POST'
      });
      const res = await req.json();
      console.log(res);
      if (res.error) {
        Alert.alert('Error ', res.message)
      } else {
        router.replace({ pathname: `/orderconfirm`, params: { data: amount } });
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Something went wrong while placing order.');
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };
  const getTotalDiscount = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + Number(item.discount ?? 0) * item.qty, 0);
  };


  const getTotalPrice = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + Number(item.price ?? 0) * item.qty, 0);
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
          contentContainerStyle={{
            paddingBottom: responsiveScreenHeight(6)
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) =>

            <View style={{ width: '95%', alignSelf: 'center', height: responsiveScreenWidth(22), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
              {item.image ? (
                <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={{ uri: item.image }} />
              ) : (
                <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={require('../assets/images/noprevew.png')} />
              )}
              <View style={{ marginLeft: 10, height: '70%', justifyContent: 'space-between', width: '40%', marginRight: 15 }}>
                <Text numberOfLines={1} style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2), color: '#333' }}>{item.name}</Text>
                <Text numberOfLines={1} style={{ fontFamily: 'novaregular' }}>{item.desc}</Text>
                <Text numberOfLines={1} style={{ fontFamily: 'novaregular' }}>{item.status}</Text>
                {item.status == "available" ? <View style={{ flexDirection: 'row', }}>
                  <Text style={{ textDecorationLine: 'line-through', fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: '#333', paddingRight: 20 }}>{"₹ " + Number(Number(item.price) + Number(item.discount))}</Text>
                  <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: '#333' }}>{"₹ " + Number(item.price)}</Text>
                </View> : <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: 'red' }}>{"Not Available"}</Text>}
                {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), flexDirection: 'row', }}>

                     <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{"₹ " + item.price}</Text>
                     <Text style={{ fontFamily: 'novaregular', color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{"₹ " + item.original_price}</Text>
                     <Text style={{ color: 'green', marginLeft: 10, fontFamily: 'novaregular' }}>{item.offer}</Text>
                </View> */}

              </View>
              <View style={{ width: '30%', height: '55%', borderWidth: 1.5, borderColor: item.status == "available" ? '#367F52' : '#ccc', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

                <AntDesign onPress={() => { item.status == "available" ? item.qty > 1 ? decreaseQuantity(item.id) : ToastAndroid.show('You have to select atleast 1 quantity .', ToastAndroid.SHORT) : null }} size={responsiveFontSize(2.5)} name="minus" color={item.status == "available" ? '#367F52' : '#ccc'} />




                <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color: item.status == "available" ? '#333' : '#ccc' }}>{item.qty}</Text>
                <AntDesign onPress={() => { item.status == "available" ? increaseQuantity(item.id) : null }} size={responsiveFontSize(2.5)} name="plus" color={item.status == "available" ? '#367F52' : '#ccc'} />
              </View>
            </View>
          }
          ListFooterComponent={() =>
            <View>
              <View style={{ borderTopWidth: 2, borderColor: '#ddd', marginTop: 20, paddingBottom: 2 }}>
                <View style={{ width: '90%', alignSelf: 'center' }}>
                  <Text style={{ borderBottomWidth: 1, borderColor: '#ccc', lineHeight: responsiveScreenWidth(15), fontSize: responsiveFontSize(2.2), fontFamily: 'novabold' }}>Bill summary</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Item total'}</Text>
                    {items && <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>₹ {Number(getTotalPrice() + getTotalDiscount()).toFixed(2)}</Text>}
                    {/* {items && <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>₹ {'160'}</Text>} */}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Shipping fee'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'free'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Total Discount'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'- ₹' + getTotalDiscount()}</Text>
                    {/* <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'- ₹'+ Number(40)}</Text> */}
                  </View>
                  <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>Bill total</Text>
                    {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>₹  {(getTotalPrice() - discount).toFixed(2)}</Text>}
                    {/* {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>₹ {Number(160) - Number(40)}</Text>} */}
                  </View>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingVertical: responsiveScreenWidth(2) }}>
                    <Text style={{ color: '#555', fontSize: responsiveFontSize(2), fontFamily: 'novaregular' }}>{'Address'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novabold', width: '45%', paddingVertical: 5 }}>{selectedAddres?.pname + ',' + selectedAddres?.address}</Text>
                  </TouchableOpacity>
                </View>

              </View>

              <View style={{ marginTop: 20, paddingHorizontal: responsiveScreenWidth(5) }}>
                <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', marginBottom: 10 }}>Select Payment Method</Text>

                {['cod', 'rpay'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    onPress={() => setPaymentMethod(method)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 14,
                      marginVertical: 5,
                      borderWidth: 1.5,
                      borderRadius: 10,
                      borderColor: paymentMethod === method ? Colors.primary : '#ccc',
                      backgroundColor: paymentMethod === method ? '#f1fff3' : '#fff',
                    }}
                  >
                    <AntDesign
                      name={paymentMethod === method ? 'checkcircle' : 'checkcircleo'}
                      size={20}
                      color={paymentMethod === method ? Colors.primary : '#aaa'}
                    />
                    <Text style={{ fontFamily: 'novaregular', marginLeft: 10, fontSize: responsiveFontSize(2) }}>
                      {method === 'cod' ? 'Cash on Delivery (COD)' : 'Card / UPI / Net Banking'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>



            </View>
          }
        />
      </View>
      <View style={{ backgroundColor: '#fff', height: responsiveScreenHeight(10), width: '100%', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#ddd', position: 'absolute', bottom: 0 }}>
        {items && <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(3), }}>₹ {(getTotalPrice() - discount).toFixed(2)}</Text>}

        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: items && (getTotalPrice() - discount) > 0 ? Colors.primary : '#ccc',
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            width: '40%'
          }}
          disabled={loading || getTotalPrice() <= 0}
          onPress={handelPlaceOrder}
        >

          <Text
            style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color: Colors.backgroundcolor }}
          >
            Checkout
          </Text>
          {/* )} */}
        </TouchableOpacity>



      </View>

    </View>
  )
}