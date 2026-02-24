import { View, RefreshControl, Text, FlatList, Image, Alert, TouchableOpacity } from 'react-native'
import React, { useCallback } from 'react'
import Header from '../../components/Header'
import AntDesign from '@expo/vector-icons/AntDesign';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';

import { _retrieveData, _removeData } from "../../local_storage";
import { useEffect, useState } from 'react';
import axios from '../../helper';
import { router, useFocusEffect } from 'expo-router';
import Colors from '../../constants/Colors';
export default function Orders() {

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
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
    setLoading(true);
    try {
      const response = await axios.get('order/get_orders.php');

      const res = response.data;
      console.log('getOrders response:', res);

      if (res.status === 'success') {
        setOrders(Array.isArray(res.data) ? res.data : []);
        // Removed incorrect setData(res.data)
      } else {
        // Fallback or error handling
        setOrders([]);
      }

    } catch (err) {
      console.error('Fetch orders error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      getOrders()
    }, [])
  )

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F7FA' }}>
      <Header title={'Your Orders'} />
      {orders.length > 0 ? (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.order_id.toString()}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => router.push({ pathname: `/orderdetails`, params: { data: item.order_id } })}
              style={{
                backgroundColor: '#fff',
                borderRadius: 12,
                marginBottom: 16,
                padding: 16,
                elevation: 3,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                borderWidth: 1,
                borderColor: '#eee'
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <View>
                  <Text style={{ fontFamily: 'novabold', fontSize: 16, color: '#333' }}>Order #{item.order_id}</Text>
                  <Text style={{ fontFamily: 'novaregular', fontSize: 13, color: '#666', marginTop: 4 }}>
                    {item.date} • {item.created_at ? item.created_at.split(' ')[1] : ''}
                  </Text>
                </View>
                <View style={{
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  backgroundColor: item.order_status === 'Completed' ? '#E8F5E9' : item.order_status === 'Pending' ? '#FFF8E1' : '#FFEBEE'
                }}>
                  <Text style={{
                    fontFamily: 'novabold',
                    fontSize: 12,
                    color: item.order_status === 'Completed' ? '#2E7D32' : item.order_status === 'Pending' ? '#F57F17' : '#C62828'
                  }}>
                    {item.order_status}
                  </Text>
                </View>
              </View>

              <View style={{ height: 1, backgroundColor: '#f0f0f0', marginBottom: 12 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontFamily: 'novamedium', fontSize: 12, color: '#888' }}>Total Amount</Text>
                  <Text style={{ fontFamily: 'novabold', fontSize: 18, color: '#333' }}>₹ {item.amount}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontFamily: 'novamedium', fontSize: 13, color: Colors.primary, marginRight: 4 }}>View Details</Text>
                  <AntDesign name="arrowright" size={16} color={Colors.primary} />
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={getOrders} colors={[Colors.primary]} />
          }
        />
      ) : (
        !loading && (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../../assets/images/homepage-con.png')} style={{ width: 100, height: 100, opacity: 0.5, marginBottom: 20 }} />
            <Text style={{ fontFamily: 'novabold', fontSize: 18, color: '#888' }}>No Orders Found</Text>
            <Text style={{ fontFamily: 'novaregular', fontSize: 14, color: '#aaa', marginTop: 5 }}>Looks like you haven't placed any orders yet.</Text>
          </View>
        )
      )}
    </View>
  )
}