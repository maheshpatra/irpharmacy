import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, StatusBar, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import axios from '../helper';

export default function OrderDetails() {
     const { data } = useLocalSearchParams();
     const [orderData, setOrderData] = useState<any>(null);
     const [loading, setLoading] = useState(true);

     const getOrder = async () => {
          setLoading(true);
          const fd = new FormData();
          const orderIdParam = Array.isArray(data) ? data[0] : data;
          fd.append("order_id", orderIdParam as string);

          try {
               const { data: res } = await axios.post("order/get_order.php", fd, {
                    headers: { "Content-Type": "multipart/form-data" }
               });

               if (res.status === 'success' && res.data) {
                    setOrderData(res.data);
               } else {
                    Alert.alert('Error', res.message || "Failed to load order details");
               }
          } catch (err) {
               console.log(JSON.stringify(err, null, 2));
          } finally {
               setLoading(false);
          }
     }

     useEffect(() => {
          getOrder();
     }, [data]);

     if (loading) {
          return (
               <View style={styles.container}>
                    <HeaderAB title={'Order Details'} />
                    <View style={styles.centerContent}>
                         <ActivityIndicator size="large" color={Colors.primary} />
                    </View>
               </View>
          )
     }

     if (!orderData) {
          return (
               <View style={styles.container}>
                    <HeaderAB title={'Order Details'} />
                    <View style={styles.centerContent}>
                         <Text style={styles.errorText}>Order not found</Text>
                    </View>
               </View>
          )
     }

     const patient = orderData.patient_details || {};
     const patientAddress = patient.address === "null" || !patient.address ? null : patient.address;

     const renderItem = ({ item }) => (
          <View style={styles.itemCard}>
               <Image
                    style={styles.itemImage}
                    source={require('../assets/images/noprevew.png')}
                    resizeMode="contain"
               />
               <View style={styles.itemDetails}>
                    <Text numberOfLines={2} style={styles.itemName}>{item.name}</Text>
                    <Text numberOfLines={1} style={styles.itemDesc}>{item.desc && item.desc !== "null" ? item.desc : item.category}</Text>
                    <View style={styles.priceRow}>
                         <Text style={styles.itemPrice}>₹ {item.price}</Text>
                         <Text style={styles.itemQty}>x {item.qty}</Text>
                    </View>
               </View>
               <View style={styles.totalAmountContainer}>
                    <Text style={styles.itemTotal}>₹ {Number(item.totalAmount || (item.price * item.qty)).toFixed(2)}</Text>
               </View>
          </View>
     );

     return (
          <View style={styles.container}>
               <StatusBar barStyle="dark-content" backgroundColor="#fff" />
               <HeaderAB title={'Order Details'} />
               <FlatList
                    data={orderData.items || []}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                         <View>
                              {/* Status and Order Info */}
                              <View style={styles.headerCard}>
                                   <View style={styles.statusRow}>
                                        <Text style={styles.orderStatusLabel}>Status</Text>
                                        <View style={[styles.statusBadge, { backgroundColor: orderData.order_status === 'Completed' ? '#E8F5E9' : '#FFF3E0' }]}>
                                             <Text style={[styles.statusText, { color: orderData.order_status === 'Completed' ? '#2E7D32' : '#EF6C00' }]}>
                                                  {orderData.order_status}
                                             </Text>
                                        </View>
                                   </View>
                                   <View style={styles.divider} />
                                   <View style={styles.infoRow}>
                                        <View>
                                             <Text style={styles.infoLabel}>Order ID</Text>
                                             <Text style={styles.infoValue}>{orderData.order_id}</Text>
                                        </View>
                                        <View style={{ alignItems: 'flex-end' }}>
                                             <Text style={styles.infoLabel}>Date</Text>
                                             <Text style={styles.infoValue}>{orderData.order_date}</Text>
                                        </View>
                                   </View>
                              </View>

                              {/* Patient Details */}
                              <View style={styles.sectionCard}>
                                   <Text style={styles.sectionTitle}>Patient Details</Text>
                                   <View style={styles.patientContainer}>
                                        <Image
                                             source={patient.gender === 'Female' ? require('../assets/images/female.jpg') : require('../assets/images/male.jpg')}
                                             style={styles.avatar}
                                        />
                                        <View style={styles.patientInfo}>
                                             <Text style={styles.patientName}>{patient.name || 'Unknown'}</Text>
                                             <Text style={styles.patientDetails}>
                                                  {patient.gender || ''}
                                                  {patient.age ? ` • ${patient.age} Years` : ''}
                                             </Text>
                                             {patientAddress && (
                                                  <Text style={styles.addressText} numberOfLines={2}>{patientAddress}</Text>
                                             )}
                                        </View>
                                   </View>
                              </View>

                              <Text style={styles.itemsHeader}>Items ({orderData.items?.length || 0})</Text>
                         </View>
                    }
                    ListFooterComponent={
                         <View style={styles.sectionCard}>
                              <Text style={styles.sectionTitle}>Bill Summary</Text>

                              <View style={styles.billRow}>
                                   <Text style={styles.billLabel}>MRP Total</Text>
                                   <Text style={styles.billValue}>₹ {Number(orderData.calculated_mrp_total || 0).toFixed(2)}</Text>
                              </View>

                              <View style={styles.billRow}>
                                   <Text style={styles.billLabel}>Total Discount</Text>
                                   <Text style={[styles.billValue, { color: '#2E7D32' }]}>- ₹ {Number(orderData.total_discount || 0).toFixed(2)}</Text>
                              </View>

                              <View style={styles.billRow}>
                                   <Text style={styles.billLabel}>GST</Text>
                                   <Text style={styles.billValue}>₹ {Number(orderData.calculated_gst_total || 0).toFixed(2)}</Text>
                              </View>

                              {Number(orderData.calculated_gst_amount || 0) > 0 && (
                                   <View style={styles.billRow}>
                                        <Text style={styles.billLabel}>GST Amount</Text>
                                        <Text style={styles.billValue}>₹ {Number(orderData.calculated_gst_amount).toFixed(2)}</Text>
                                   </View>
                              )}

                              <View style={styles.divider} />

                              <View style={styles.totalRow}>
                                   <Text style={styles.totalLabel}>Total Paid</Text>
                                   <Text style={styles.totalValue}>₹ {Number(orderData.amount_paid || 0).toFixed(2)}</Text>
                              </View>

                              <View style={[styles.billRow, { marginTop: 12 }]}>
                                   <Text style={styles.billLabel}>Payment Status</Text>
                                   <Text style={[styles.billValue, { color: orderData.payment_status === 'Paid' ? '#2E7D32' : '#F57C00', fontFamily: 'novabold' }]}>
                                        {orderData.payment_status}
                                   </Text>
                              </View>

                              {orderData.pharmacy_name && (
                                   <View style={styles.pharmacyRow}>
                                        <Text style={styles.pharmacyLabel}>Fulfilled by </Text>
                                        <Text style={styles.pharmacyValue}>{orderData.pharmacy_name}</Text>
                                   </View>
                              )}
                         </View>
                    }
               />
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F5F7FA',
     },
     centerContent: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
     },
     errorText: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(2),
          color: '#666',
     },
     listContent: {
          paddingBottom: 40,
          paddingTop: 10,
     },
     headerCard: {
          backgroundColor: '#fff',
          marginHorizontal: 15,
          marginTop: 10,
          borderRadius: 12,
          padding: 15,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginBottom: 15,
     },
     statusRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 12,
     },
     orderStatusLabel: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2.2),
          color: '#333',
     },
     statusBadge: {
          paddingHorizontal: 12,
          paddingVertical: 4,
          borderRadius: 20,
     },
     statusText: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
     },
     divider: {
          height: 1,
          backgroundColor: '#EEE',
          marginVertical: 10,
     },
     infoRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
     },
     infoLabel: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.6),
          color: '#888',
          marginBottom: 4,
     },
     infoValue: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
          color: '#333',
     },
     sectionCard: {
          backgroundColor: '#fff',
          marginHorizontal: 15,
          borderRadius: 12,
          padding: 15,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          marginBottom: 15,
     },
     sectionTitle: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
          marginBottom: 12,
     },
     patientContainer: {
          flexDirection: 'row',
          alignItems: 'flex-start',
     },
     avatar: {
          height: 50,
          width: 50,
          borderRadius: 25,
          marginRight: 15,
          backgroundColor: '#eee',
     },
     patientInfo: {
          flex: 1,
          justifyContent: 'center',
     },
     patientName: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
          marginBottom: 2,
     },
     patientDetails: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.8),
          color: '#666',
          marginBottom: 4,
     },
     addressText: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.6),
          color: '#666',
          marginTop: 4,
          lineHeight: 20,
     },
     itemsHeader: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
          marginLeft: 15,
          marginBottom: 10,
     },
     itemCard: {
          backgroundColor: '#fff',
          marginHorizontal: 15,
          marginBottom: 10,
          borderRadius: 10,
          padding: 12,
          flexDirection: 'row',
          alignItems: 'center',
          elevation: 1,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
     },
     itemImage: {
          height: 50,
          width: 50,
          marginRight: 15,
          borderRadius: 8,
          backgroundColor: '#f8f8f8',
     },
     itemDetails: {
          flex: 1,
          marginRight: 10,
     },
     itemName: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
          color: '#333',
          marginBottom: 4,
     },
     itemDesc: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.5),
          color: '#888',
          marginBottom: 6,
     },
     priceRow: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     itemPrice: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
          color: '#333',
          marginRight: 10,
     },
     itemQty: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.6),
          color: '#666',
     },
     totalAmountContainer: {
          justifyContent: 'center',
          alignItems: 'flex-end',
     },
     itemTotal: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.9),
          color: '#333',
     },
     billRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
     },
     billLabel: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.8),
          color: '#555',
     },
     billValue: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
          color: '#333',
     },
     totalRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
          marginBottom: 5,
     },
     totalLabel: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2.2),
          color: '#333',
     },
     totalValue: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2.2),
          color: Colors.primary,
     },
     pharmacyRow: {
          marginTop: 15,
          paddingTop: 10,
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          flexDirection: 'row',
          justifyContent: 'flex-start',
          alignItems: 'center',
     },
     pharmacyLabel: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.6),
          color: '#888',
          marginRight: 5,
     },
     pharmacyValue: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.7),
          color: '#555',
     },
});