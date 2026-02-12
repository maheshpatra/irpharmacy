import { View, RefreshControl, Text, FlatList, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import Header from '../../components/Header'
import AntDesign from '@expo/vector-icons/AntDesign';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';

import { _retrieveData, _removeData } from "../../local_storage";
import { useEffect, useState } from 'react';
import axios from '../../helper';
import { router, useFocusEffect } from 'expo-router';
export default function Orders() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const [medichine, setMedichine] = useState([])



  useEffect(() => {

    _retrieveData("USER_DATA").then((userdata) => {
      console.log(userdata);
      if (userdata && userdata !== 'error') {
        setData(userdata)

      } else {
        Alert.alert('Error', 'user not found!')

      }

    });
  }, [])

  const getOrders = useCallback(async () => {
    // 0. Ensure we have a mobile to query
    const mobile = data?.mobile;
    if (!mobile) {
      return;
    }

    setLoading(true);
    try {
      // 1. Build JSON payload
      const payload = {
        case: 'get_orders_by_mobile',
        mobile,
      };
      console.log(payload)
      // 2. Fire the request
      const response = await axios.post('order/order.php', payload);

      // 3. HTTP‐level error?

      // 4. Parse JSON
      const res = response.data;
      console.log('getOrders response:', res);

      // 5. API‐level error?
      if (res.error) {
        throw new Error(res.message || 'Unknown server error');
      }

      // 6. Set state (fall back to empty array)
      setOrders(Array.isArray(res.orders) ? res.orders : []);
    } catch (err) {
      console.error('Fetch orders error:', err);
      Alert.alert('Error fetching orders', err.message);
    } finally {
      // 7. Always clear loading
      setLoading(false);
    }
  }, [data?.mobile]);

  useFocusEffect(
    useCallback(() => {
      getOrders()
      return () => {
      }
    }, [data])
  )

  useEffect(() => {
    getOrders()
  }, [data])
  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header title={'Your Order'} />
      {orders.length > 0 ? <FlatList
        data={orders}

        renderItem={({ item, index }) =>

          <TouchableOpacity onPress={() => router.push({ pathname: `/orderdetails`, params: { data: item.id } })} style={{ width: '90%', alignSelf: 'center', height: responsiveScreenWidth(30), borderBottomWidth: 2, borderColor: '#ccc', flexDirection: 'row', alignItems: 'center' }}>
            <Image style={{ height: 50, width: 50, marginLeft: 15 }} source={require('../../assets/images/homepage-con.png')} />
            <View style={{ marginLeft: 10, height: '70%', justifyContent: 'space-between' }}>
              <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: '#333' }}>Order No {"# " + item.order_id}</Text>
              <Text style={{ fontFamily: 'novaregular' }}>Order on {item.date}</Text>
              <View style={{ backgroundColor: '#e3f6da', width: responsiveScreenWidth(42), justifyContent: 'center', alignItems: 'center', height: responsiveScreenWidth(6), borderRadius: 10, }}>
                <Text style={{ fontFamily: 'novabold', color: 'green' }}>{item.order_status}</Text>
              </View>
            </View>
          </TouchableOpacity>
        }
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getOrders} />
        }
      /> :
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontFamily: 'novabold', fontSize: 21, color: '#555' }}>No Order found ! </Text>
        </View>
      }
    </View>
  )
}