import { View, ScrollView, Text, FlatList, Image, TouchableOpacity, Alert, Modal, TextInput, ToastAndroid } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth, responsiveScreenFontSize } from 'react-native-responsive-dimensions'
import RazorpayCheckout from 'react-native-razorpay';
import AntDesign from '@expo/vector-icons/AntDesign';
import Colors from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import { _retrieveData, _storeData } from '../local_storage';

import axios from '../helper';
export default function Checkout() {
  const params = useLocalSearchParams()
  const [data, setData] = useState(null)
  const [items, setItems] = useState(null);
  const [pdata, setpdata] = useState(null);
  const [status, setStatus] = useState(null);
  const [address, setaddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(null);
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
        setaddress(mdata.address.address)
        console.log(mdata.medicine)
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


  const handleRpay = async () => {
    const amount = getFinal().toFixed(2)
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
      console.log(paymentData);
      placeOnlineOrder(paymentData);
    }).catch((error) => {
      Alert.alert('Payment Failed', 'Payment Cancelled By User.');
    });
  };

  const handlePlaceOrder = async () => {
    const total = getFinal().toFixed(2)

    // 1. If not COD or no chargeable amount → online pay
    if (total <= 0 || paymentMethod !== 'cod') {
      return handleRpay();
    }

    if (data?.mobile == '') {
      ToastAndroid.long('Invalid Number', ToastAndroid.LONG)
      return
    }

    // 2. Make sure cart isn’t empty
    const cartItems = items.filter(item => item.qty > 0);
    if (!cartItems.length) {
      Alert.alert('Cart is empty', 'Please add at least one item to your order.');
      return;
    }

    setLoading(true);
    try {
      // 3. Build JSON payload matching your PHP keys
      const payload = {
        case: 'order',
        mobile: data?.mobile ?? '',
        name: data?.username ?? '',
        prescription_id: id ?? '',
        address: address ?? '',
        pdata: pdata,               // will be stored as p_data
        amount: getFinal().toFixed(2),
        discount: getTotalDiscountp().toFixed(2),
        payment_status: 'pending',               // matches your payment_status column
        paymentmode: 'cash',                  // matches your paymentmode column
        order_details: items,         // matches your paymentmode column
        pharId: 12,                   // your pharmacy ID
        buyer_id: data?.userid ?? '',
        drname: '',                      // if you want to record a doctor’s name
        // order_type, order_details, order_status, date, onlinepaymethod, onlinepayid 
        // will all default server-side if you don’t send them
      };

      // 4. Fire the request
      const { data: res } = await axios.post(
        'order/order.php',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('PlaceOrder response:', res);

      // 5. Handle API errors
      if (!res.error) {
        const total = getFinal();
        const orderId = res.order_id;

        router.replace({
          pathname: '/orderconfirm',
          params: {
            total,
            order_id: orderId
          }
        });

      }

      // 6. Success: navigate to confirmation
      // router.replace({
      //   pathname: '/orderconfirm',
      //   params: { total }
      // });

    } catch (error) {

      const message =
        error.response?.data?.message
        || error.message
        || 'Order Failed! Something went wrong';
      ToastAndroid.show(message, ToastAndroid.LONG);
    } finally {
      setLoading(false);
    }
  };



  const checkStock = async (selectedItems, pincode) => {
    const sit = selectedItems.map(item => item.id)
    console.log(sit)
    try {
      const { data } = await axios.post('medicine/check_stock.php', {
        selectedItems: selectedItems.map(item => item.id),
        pincode: pincode,
      }, {
        headers: {
          'Content-Type': 'application/json',
        }
      });


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


  const getTotalDiscountp = () => {
    if (!Array.isArray(items)) return 0;

    return items.reduce((total, item) => {
      const price = Number(item.price ?? 0);
      const discountRate = Number(item.discount ?? 0);
      const qty = Number(item.qty ?? 1);

      const discountAmount = price * (discountRate / 100) * qty;
      return total + discountAmount;
    }, 0);
  };



  const placeOnlineOrder = async (paymentData) => {
    const amount = getFinal()
    const m_data = items.filter(item => item.qty >= 1);
    setLoading(true);

    try {
      const payload = {
        case: 'order',
        mobile: data?.mobile ?? '',
        name: data?.username ?? '',
        prescription_id: id ?? '',
        address: address ?? '',
        pdata: pdata,               // will be stored as p_data
        amount: getFinal().toFixed(2),
        discount: getTotalDiscountp().toFixed(2),
        payment_status: 'Paid',               // matches your payment_status column
        paymentmode: 'RPAY',                  // matches your paymentmode column
        order_details: items,         // matches your paymentmode column
        pharId: 12,                   // your pharmacy ID
        buyer_id: data?.userid ?? '',
        drname: '',
        onlinepaymethod: "Online (R-Pay)",
        onlinepayid: paymentData.razorpay_payment_id                    // if you want to record a doctor’s name

      };

      // 4. Fire the request
      const { data: res } = await axios.post(
        'order/order.php',
        payload,
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log('PlaceOrder response:', res);


      if (!res.error) {
        const total = getFinal().toFixed(2);
        const orderId = res.order_id;

        router.replace({
          pathname: '/orderconfirm',
          params: {
            total,
            order_id: orderId
          }
        });

      }

    } catch (error) {
      const message =
        error.response?.data?.message
        || error.message
        || 'Order Failed! Something went wrong';

      // show a toast for 3.5 seconds
      ToastAndroid.show(message, ToastAndroid.LONG);
    }
  };

  const increaseQuantity = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item));
  };
  const getTotalDiscount = () => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => total + Number(item.discount ?? 0) * item.qty, 0);
  };



  const getTotalGst = () => {
    if (!Array.isArray(items)) return 0;

    return items.reduce((total, item) => {
      const price = Number(item.price ?? 0);
      const discountRate = Number(item.discount ?? 0);
      const gstRate = Number(item.gst ?? 0);
      const qty = Number(item.qty ?? 1);

      const discountAmount = price * (discountRate / 100);
      const discountedPrice = price - discountAmount;
      const gstAmount = discountedPrice * (gstRate / 100);

      return total + (gstAmount * qty);
    }, 0);
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
  const getFinal = () => {
    if (!Array.isArray(items)) return 0;

    return items.reduce((total, item) => {
      const price = Number(item.price ?? 0); // base price
      const discountRate = Number(item.discount ?? 0);
      const gstRate = Number(item.gst ?? 0);
      const qty = Number(item.qty ?? 1);

      const discountAmount = price * (discountRate / 100);
      const discountedPrice = price - discountAmount;
      const gstAmount = discountedPrice * (gstRate / 100);
      const finalPrice = (discountedPrice + gstAmount) * qty;

      return total + finalPrice;
    }, 0);
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
          renderItem={({ item, index }) => {

            const price = Number(item.price); // selling price (after discount)
            const discountRate = Number(item.discount); // percentage
            const gstRate = Number(item.gst);

            const discountAmount = price * (discountRate / 100); // discount in ₹
            const priceAfterDiscount = price - discountAmount;
            const gstAmount = priceAfterDiscount * (gstRate / 100);
            const totalPayable = priceAfterDiscount + gstAmount;
            return (
              <View style={{ width: '95%', alignSelf: 'center', height: responsiveScreenWidth(27), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
                {item.image ? (
                  <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={{ uri: item.image }} />
                ) : (
                  <Image style={{ height: responsiveScreenWidth(12), width: responsiveScreenWidth(12), marginLeft: 15 }} source={require('../assets/images/noprevew.png')} />
                )}
                <View style={{ marginLeft: 10, height: '75%', justifyContent: 'space-between', width: '40%', marginRight: 15 }}>
                  <Text numberOfLines={1} style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2), color: '#333' }}>{item.name}</Text>
                  <Text numberOfLines={1} style={{ fontFamily: 'novaregular' }}>{item.desc}</Text>
                  {item.status == "available" ? <View style={{ flexDirection: 'row', }}>
                    <Text style={{ textDecorationLine: 'line-through', fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: '#333', paddingRight: 20 }}>{"₹" + price.toFixed(0)}</Text>
                    <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.8), color: 'green' }}>{"₹" + discountAmount.toFixed(1) + " (" + discountRate + "%) off"}</Text>

                  </View> : <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(2), color: 'red' }}>{"Not Available"}</Text>}
                  {item.status == "available" && <Text style={{ fontFamily: 'novaregular', fontSize: responsiveFontSize(1.7), color: '#333', }}>{"GST: ₹" + gstAmount.toFixed(2) + " (" + gstRate + "%)"}</Text>}
                  {item.status == "available" && <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2), color: '#000080', }}>₹ {totalPayable.toFixed(2)}</Text>}
                  {/* <View style={{ justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), flexDirection: 'row', }}>

                     <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.2), color: '#333' }}>{"₹ " + item.price}</Text>
                     <Text style={{ fontFamily: 'novaregular', color: '#555', marginLeft: 10, textDecorationLine: 'line-through', textDecorationStyle: 'solid' }}>{"₹ " + item.original_price}</Text>
                     <Text style={{ color: 'green', marginLeft: 10, fontFamily: 'novaregular' }}>{item.offer}</Text>
                </View> */}

                </View>
                <View style={{ width: '25%', height: '40%', borderWidth: 1.5, borderColor: item.status == "available" ? '#367F52' : '#ccc', borderRadius: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10 }}>

                  <AntDesign onPress={() => { item.status == "available" ? item.qty > 1 ? decreaseQuantity(item.id) : ToastAndroid.show('You have to select atleast 1 quantity .', ToastAndroid.SHORT) : null }} size={responsiveFontSize(2.5)} name="minus" color={item.status == "available" ? '#367F52' : '#ccc'} />




                  <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(2.3), color: item.status == "available" ? '#333' : '#ccc' }}>{item.qty}</Text>
                  <AntDesign onPress={() => { item.status == "available" ? increaseQuantity(item.id) : null }} size={responsiveFontSize(2.5)} name="plus" color={item.status == "available" ? '#367F52' : '#ccc'} />
                </View>
              </View>
            )
          }}
          ListFooterComponent={() =>
            <View>
              <View style={{ borderTopWidth: 2, borderColor: '#ddd', marginTop: 20, paddingBottom: 2 }}>
                <View style={{ width: '90%', alignSelf: 'center' }}>
                  <Text style={{ borderBottomWidth: 1, borderColor: '#ccc', lineHeight: responsiveScreenWidth(15), fontSize: responsiveFontSize(2.2), fontFamily: 'novabold' }}>Bill summary</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Item total'}</Text>
                    {items && <Text style={{ color: 'green', fontFamily: 'novabold', fontSize: responsiveFontSize(2) }}>₹ {Number(getTotalPrice()).toFixed(2)}</Text>}
                    {/* {items && <Text style={{ color: 'green', fontSize: responsiveFontSize(2) }}>₹ {'160'}</Text>} */}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Discount'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{"- " + getTotalDiscountp().toFixed(2)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'Shipping fee'}</Text>
                    <Text style={{ color: 'green', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'free'}</Text>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', height: 35 }}>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{'GST'}</Text>
                    <Text style={{ color: '#000', fontSize: responsiveFontSize(2), fontFamily: 'novaregular', }}>{getTotalGst().toFixed(2)}</Text>
                  </View>

                  <View style={{ borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(12), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

                    <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', }}>Bill total</Text>
                    {items && <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'novabold', color: '#f1735a' }}>₹  {getFinal().toFixed(2)}</Text>}
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
        {items && <Text style={{ fontFamily: 'novabold', fontSize: responsiveFontSize(3), }}>₹ {(getFinal()).toFixed(2)}</Text>}

        <TouchableOpacity
          style={{
            height: 50,
            backgroundColor: items && getFinal() > 0 ? Colors.primary : '#ccc',
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 6,
            width: '40%'
          }}
          disabled={loading || getFinal() <= 0}
          onPress={handlePlaceOrder}
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