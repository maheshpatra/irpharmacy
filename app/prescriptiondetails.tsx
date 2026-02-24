import { View, Text, FlatList, Image, TouchableOpacity, Modal, Alert, TextInput, ToastAndroid, ActivityIndicator, StyleSheet, ScrollView, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import HeaderAB from '../components/HeaderAB'
import { responsiveFontSize, responsiveScreenHeight, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import { Entypo, AntDesign, MaterialIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { router, useLocalSearchParams } from 'expo-router';
import axios from '../helper';
import { _retrieveData, _storeData } from '../local_storage';
import AddressList from '../components/AddressList';
import * as Location from 'expo-location';

export default function PrepscriptionDetails() {
     const [modalVisible, setModalVisible] = useState(false);
     const [address, setaddress] = useState(null);
     const [addresslist, setaddresslist] = useState([]);
     const { data } = useLocalSearchParams();
     const [addresstype, setaddresstype] = useState('Home');
     const [pdata, setpdata] = useState(null);
     const [status, setStatus] = useState(null);
     const [discount, setDiscount] = useState(0);
     const [image, setimage] = useState(null);
     const [pin, setpin] = useState('');
     const [spin, setspin] = useState(null);
     const [fulladd, setfulladd] = useState('');
     const [recipt, setrecipt] = useState('');
     const [mnumber, setnum] = useState('');
     const [user, setuser] = useState<any>('');
     const [lmodalVisible, setlModalVisible] = useState(false);
     const [items, setItems] = useState<any[]>([]);
     const [sitems, setsItems] = useState<any[]>([]);
     const [loading, setLoading] = useState(false);
     const [locationLoading, setLocationLoading] = useState(false);


     const getmedprice = async () => {
          if (!sitems || sitems.length === 0) {
               Alert.alert('No Items Selected', 'Please select at least one medicine to proceed.');
               return;
          }
          setLoading(true);
          const m_data = sitems
               .filter(item => item.id)
               .map(item => ({ id: item.id }));
          const mydata = JSON.stringify({ data: m_data, pincode: spin })
          let bodyContent = new FormData();
          bodyContent.append("medDetail", mydata);
          bodyContent.append("case", "mediciDetail");

          try {
               let { data: data_ } = await axios.post("medicine/medicine.php", bodyContent, {
                    headers: { "Content-Type": "multipart/form-data" }
               });

               if (!data_.error) {
                    const my_data = { medicine: data_, pdata: pdata ? pdata[0] : {}, address: address, pid: data, discount: discount, total: 0 }
                    const KEY = 'MED'
                    await _storeData(KEY, my_data);
                    router.replace({ pathname: `/checkout`, params: { ...address } })
               } else {
                    Alert.alert(
                         "⚠️ Medicine Not Available",
                         "The selected medicine is currently not available for the entered pin code.\n\nPlease check the pin code or try searching for another medicine.",
                         [
                              { text: "OK", onPress: () => console.log("User acknowledged alert") }
                         ],
                         { cancelable: false }
                    );
               }
          } catch (error) {
               console.log(error);
               Alert.alert('Error', 'Something went wrong while fetching medicine details.');
          } finally {
               setLoading(false)
          }
     }

     const addAddress = async () => {
          if (!fulladd || !pin || !recipt || !mnumber) {
               ToastAndroid.show("Please fill all fields", ToastAndroid.SHORT);
               return;
          }
          setLoading(true)

          try {
               const add = fulladd + ' ' + pin
               let headersList = {
                    "Accept": "*/*"
               }

               let bodyContent = new FormData();
               bodyContent.append("mobileno", user?.mobile);
               bodyContent.append("usermob", mnumber);
               bodyContent.append("pname", recipt);
               bodyContent.append("address", add);
               bodyContent.append("type", addresstype);

               let { data } = await axios.post("address/add_address.php", bodyContent, {
                    headers: headersList
               });
               if (data.status === "success") {
                    ToastAndroid.show(data.message, ToastAndroid.SHORT);
                    getalladdress(user);
                    setModalVisible(false);
                    // Reset form
                    setrecipt('');
                    setpin('');
                    setfulladd('');
                    setnum('');
               } else {
                    ToastAndroid.show(data.message || "Failed to add address", ToastAndroid.SHORT);
               }
          } catch (error) {
               console.log(error);
               ToastAndroid.show("Error adding address", ToastAndroid.SHORT);
          } finally {
               setLoading(false)
          }
     };

     const getCurrentLocation = async () => {
          setLocationLoading(true);
          try {
               let { status } = await Location.requestForegroundPermissionsAsync();
               if (status !== 'granted') {
                    Alert.alert('Permission Denied', 'Permission to access location was denied. Please enter address manually.');
                    return;
               }

               let location = await Location.getCurrentPositionAsync({});
               let addresses = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
               });

               if (addresses && addresses.length > 0) {
                    const addr = addresses[0];
                    setpin(addr.postalCode || '');
                    const street = addr.street || '';
                    const name = addr.name || '';
                    const city = addr.city || '';
                    const region = addr.region || '';
                    // Construct a readable address avoiding duplicates
                    let formattedAddress = '';
                    if (name && name !== street) formattedAddress += name + ', ';
                    formattedAddress += street;
                    if (city) formattedAddress += ', ' + city;
                    if (region) formattedAddress += ', ' + region;

                    setfulladd(formattedAddress);
               }
          } catch (error) {
               Alert.alert('Error', 'Failed to fetch location. Please enter manually.');
          } finally {
               setLocationLoading(false);
          }
     };

     useEffect(() => {
          _retrieveData("USER_DATA").then((data) => {
               setuser(data)
               if (data) getalladdress(data)
          })
     }, [])


     const getalladdress = async (m_data) => {
          try {
               let headersList = { "Accept": "*/*" }
               let bodyContent = new FormData();
               bodyContent.append("mobileno", m_data.mobile);

               let { data } = await axios.post("address/selectaddress.php", bodyContent, {
                    headers: headersList
               });
               if (data.status === "success") {
                    setaddresslist(data.data)
               }
          } catch (error) {
               console.log(error);
          }
     }

     const gotocheckout = () => {
          getmedprice()
     }

     const getprescription = async () => {
          setLoading(true)
          try {
               const { data: res } = await axios.get(`prescription/get_prescription.php?id=${data}`);

               if (res.status === "success" && res.data && res.data.length > 0) {
                    const item = res.data[0];

                    let mData = item.medicine_data;
                    if (typeof mData === 'string') {
                         try { mData = JSON.parse(mData); } catch (e) { console.log(e) }
                    }
                    setItems(mData || []);
                    setsItems(mData || []);

                    let pData = item.patient_details;
                    if (typeof pData === 'string') {
                         try { pData = JSON.parse(pData); } catch (e) { console.log(e) }
                    }
                    setpdata(Array.isArray(pData) ? pData : [pData]);

                    setStatus(item.type)
                    setDiscount(item.discount)
                    setimage(item.image)
               }
          } catch (err) {
               console.log(JSON.stringify(err, null, 2));
          } finally {
               setLoading(false)
          }
     }

     useEffect(() => {
          getprescription()
     }, [data])

     const handleCheck = (id) => {
          const item = items.find(i => i.id === id);
          const alreadySelected = sitems?.some(s => s.id === id);

          if (alreadySelected) {
               setsItems(prev => prev.filter(i => i.id !== id));
          } else {
               setsItems(prev => [...prev, { ...item, qty: 1 }]);
          }
     };

     const handleSelectAddress = (add) => {
          const addressVal = add.address;
          const match = addressVal.match(/(\d{6})/);
          const pincode = match ? match[1] : null;
          setaddress(add)
          setlModalVisible(false);
          setspin(pincode)
     };

     const renderHeader = () => (
          <View>
               {/* Patient Profile Card */}
               <View style={styles.card}>
                    {pdata && pdata[0] && (
                         <View style={styles.patientRow}>
                              <Image
                                   resizeMode='cover'
                                   style={styles.patientImage}
                                   source={pdata[0].gender == 'Female' ? require('../assets/images/female.jpg') : require('../assets/images/male.jpg')}
                              />
                              <View style={styles.patientInfo}>
                                   <Text style={styles.patientName}>{pdata[0].name}</Text>
                                   <Text style={styles.patientDetails}>{pdata[0].gender} • {pdata[0].age} Years</Text>
                              </View>
                         </View>
                    )}
               </View>

               {/* Prescription Image */}
               {image && (
                    <View style={styles.card}>
                         <Text style={styles.sectionTitle}>Prescription</Text>
                         <Image
                              resizeMode='contain'
                              source={{ uri: image }}
                              style={styles.prescriptionImage}
                         />
                    </View>
               )}

               {/* Medicines Header */}
               <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Select Medicines</Text>
                    <Text style={styles.subtitle}>Confim medicines to purchase</Text>
               </View>
          </View>
     );

     return (
          <View style={styles.container}>
               <StatusBar barStyle="dark-content" backgroundColor="#fff" />
               <HeaderAB title={'Prescription Details'} />

               <FlatList
                    data={items}
                    keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 100 }}
                    ListHeaderComponent={renderHeader}
                    renderItem={({ item }) => (
                         <TouchableOpacity activeOpacity={0.8} onPress={() => handleCheck(item.id)} style={styles.medicineCard}>
                              <View style={styles.medicineImageContainer}>
                                   {item.image ? (
                                        <Image style={styles.medicineImage} source={{ uri: item.image }} />
                                   ) : (
                                        <Image style={styles.medicineImage} source={require('../assets/images/noprevew.png')} />
                                   )}
                              </View>
                              <View style={styles.medicineDetails}>
                                   <Text numberOfLines={1} style={styles.medicineName}>{item.name}</Text>
                                   <Text numberOfLines={1} style={styles.medicineDesc}>{item.desc}</Text>
                              </View>
                              <View style={styles.checkboxContainer}>
                                   {sitems?.some(i => i.id === item.id) ? (
                                        <MaterialIcons name="check-box" size={28} color={Colors.primary} />
                                   ) : (
                                        <MaterialIcons name="check-box-outline-blank" size={28} color="#ccc" />
                                   )}
                              </View>
                         </TouchableOpacity>
                    )}
                    ListFooterComponent={() => (
                         <View style={styles.footerContainer}>
                              <View style={styles.addressSection}>
                                   <View style={styles.addressHeader}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                             <Entypo name="location-pin" size={20} color={Colors.primary} />
                                             <Text style={styles.addressLabel}>Delivering to</Text>
                                        </View>
                                        <TouchableOpacity onPress={() => address ? setlModalVisible(true) : setModalVisible(true)}>
                                             <Text style={styles.changeBtn}>CHANGE</Text>
                                        </TouchableOpacity>
                                   </View>

                                   {address ? (
                                        <TouchableOpacity onPress={() => setlModalVisible(true)}>
                                             <Text style={styles.addressText} numberOfLines={2}>
                                                  <Text style={styles.addressName}>{address.pname}</Text> {address.address}
                                             </Text>
                                        </TouchableOpacity>
                                   ) : (
                                        <TouchableOpacity style={styles.addAddressBtn} onPress={() => setModalVisible(true)}>
                                             <AntDesign name="plus" size={18} color={Colors.primary} />
                                             <Text style={styles.addAddressText}>Add New Address</Text>
                                        </TouchableOpacity>
                                   )}
                              </View>
                         </View>
                    )}
               />

               {/* Bottom Action Bar */}
               <View style={styles.bottomBar}>
                    <View style={styles.selectedCount}>
                         <Text style={styles.selectedLabel}>{sitems.length} Items Selected</Text>
                    </View>
                    <TouchableOpacity
                         style={[styles.proceedBtn, { opacity: sitems.length > 0 ? 1 : 0.6 }]}
                         onPress={() => {
                              if (address) {
                                   gotocheckout();
                              } else {
                                   Alert.alert('Address Required', 'Please add a delivery address first', [
                                        { text: 'Add Address', onPress: () => setModalVisible(true) }
                                   ]);
                              }
                         }}
                         disabled={loading}
                    >
                         {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.proceedText}>Proceed</Text>}
                    </TouchableOpacity>
               </View>

               {/* Address Selection List Modal */}
               <AddressList
                    visible={lmodalVisible}
                    onClose={() => setlModalVisible(false)}
                    addresses={addresslist}
                    onSelect={handleSelectAddress}
                    loading={loading}
               />

               {/* Add New Address Modal */}
               <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
               >
                    <View style={styles.modalOverlay}>
                         <View style={styles.modalContent}>
                              <View style={styles.modalHeader}>
                                   <Text style={styles.modalTitle}>Add Address Details</Text>
                                   <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeBtn}>
                                        <AntDesign name="close" size={24} color="#555" />
                                   </TouchableOpacity>
                              </View>

                              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>

                                   <TouchableOpacity
                                        style={styles.locationBtn}
                                        onPress={getCurrentLocation}
                                        disabled={locationLoading}
                                   >
                                        {locationLoading ? (
                                             <ActivityIndicator size="small" color={Colors.primary} />
                                        ) : (
                                             <>
                                                  <FontAwesome5 name="location-arrow" size={16} color={Colors.primary} />
                                                  <Text style={styles.locationBtnText}>Use My Current Location</Text>
                                             </>
                                        )}
                                   </TouchableOpacity>

                                   <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Pincode*</Text>
                                        <TextInput
                                             value={pin}
                                             onChangeText={setpin}
                                             keyboardType="number-pad"
                                             placeholder="Ex: 700091"
                                             style={styles.input}
                                        />
                                   </View>

                                   <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>House no, Building, Street, Area*</Text>
                                        <TextInput
                                             value={fulladd}
                                             onChangeText={setfulladd}
                                             placeholder="Enter full address"
                                             multiline
                                             style={[styles.input, { height: 80, textAlignVertical: 'top', paddingTop: 10 }]}
                                        />
                                   </View>

                                   <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Recipient Name*</Text>
                                        <TextInput
                                             value={recipt}
                                             onChangeText={setrecipt}
                                             placeholder="Name of receiver"
                                             style={styles.input}
                                        />
                                   </View>

                                   <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Phone Number*</Text>
                                        <TextInput
                                             value={mnumber}
                                             onChangeText={setnum}
                                             keyboardType="phone-pad"
                                             placeholder="10-digit mobile number"
                                             style={styles.input}
                                        />
                                   </View>

                                   <View style={styles.inputGroup}>
                                        <Text style={styles.inputLabel}>Address Type</Text>
                                        <View style={styles.typeContainer}>
                                             {['Home', 'Office', 'Other'].map((type) => (
                                                  <TouchableOpacity
                                                       key={type}
                                                       onPress={() => setaddresstype(type)}
                                                       style={[styles.typeBtn, addresstype === type && styles.typeBtnActive]}
                                                  >
                                                       <Text style={[styles.typeText, addresstype === type && styles.typeTextActive]}>{type}</Text>
                                                  </TouchableOpacity>
                                             ))}
                                        </View>
                                   </View>

                                   <View style={{ height: 20 }} />
                              </ScrollView>

                              <View style={styles.modalFooter}>
                                   <TouchableOpacity
                                        style={styles.saveBtn}
                                        disabled={loading}
                                        onPress={addAddress}
                                   >
                                        {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.saveBtnText}>Save Address</Text>}
                                   </TouchableOpacity>
                              </View>
                         </View>
                    </View>
               </Modal>
          </View>
     )
}

const styles = StyleSheet.create({
     container: {
          flex: 1,
          backgroundColor: '#F7F7F7',
     },
     card: {
          backgroundColor: '#fff',
          marginHorizontal: 15,
          marginTop: 15,
          borderRadius: 12,
          padding: 15,
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
     },
     patientRow: {
          flexDirection: 'row',
          alignItems: 'center',
     },
     patientImage: {
          height: 50,
          width: 50,
          borderRadius: 25,
          marginRight: 15,
          backgroundColor: '#eee',
     },
     patientInfo: {
          flex: 1,
     },
     patientName: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
     },
     patientDetails: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.8),
          color: '#666',
     },
     sectionHeader: {
          marginHorizontal: 15,
          marginTop: 20,
          marginBottom: 10,
     },
     sectionTitle: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
          marginBottom: 5,
     },
     subtitle: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.6),
          color: '#888',
     },
     prescriptionImage: {
          height: responsiveScreenWidth(50),
          width: '100%',
          borderRadius: 8,
          marginTop: 10,
          backgroundColor: '#f0f0f0',
     },
     medicineCard: {
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
     medicineImageContainer: {
          height: 50,
          width: 50,
          borderRadius: 8,
          backgroundColor: '#F5F5F5',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 12,
     },
     medicineImage: {
          height: 40,
          width: 40,
          resizeMode: 'contain',
     },
     medicineDetails: {
          flex: 1,
          marginRight: 10,
     },
     medicineName: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.9),
          color: '#333',
          marginBottom: 4,
     },
     medicineDesc: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.6),
          color: '#888',
     },
     checkboxContainer: {
          padding: 5,
     },
     footerContainer: {
          marginTop: 10,
          marginBottom: 20,
     },
     addressSection: {
          backgroundColor: '#fff',
          marginHorizontal: 15,
          borderRadius: 12,
          padding: 15,
          elevation: 2,
     },
     addressHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 10,
     },
     addressLabel: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
          marginLeft: 5,
     },
     changeBtn: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.6),
          color: Colors.primary,
     },
     addressText: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.8),
          color: '#555',
          lineHeight: 22,
     },
     addressName: {
          fontFamily: 'novabold',
          color: '#333',
     },
     addAddressBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 10,
     },
     addAddressText: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
          color: Colors.primary,
          marginLeft: 8,
     },
     bottomBar: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderColor: '#eee',
          paddingHorizontal: 20,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          elevation: 10,
     },
     selectedCount: {
          flex: 1,
     },
     selectedLabel: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#333',
     },
     proceedBtn: {
          backgroundColor: Colors.primary || 'green',
          paddingVertical: 12,
          paddingHorizontal: 30,
          borderRadius: 8,
          elevation: 2,
     },
     proceedText: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#fff',
     },
     // Modal Styles
     modalOverlay: {
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
          justifyContent: 'flex-end',
     },
     modalContent: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: '75%',
          width: '100%',
     },
     modalHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#eee',
     },
     modalTitle: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2.2),
          color: '#333',
     },
     closeBtn: {
          padding: 5,
     },
     modalBody: {
          padding: 20,
     },
     locationBtn: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F0F7F4', // Light green bg
          padding: 15,
          borderRadius: 8,
          marginBottom: 20,
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: '#D4E8DC',
     },
     locationBtnText: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(1.8),
          color: Colors.primary,
          marginLeft: 10,
     },
     inputGroup: {
          marginBottom: 20,
     },
     inputLabel: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.7),
          color: '#666',
          marginBottom: 8,
     },
     input: {
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 10,
          fontSize: responsiveFontSize(1.8),
          fontFamily: 'novaregular',
          color: '#333',
          backgroundColor: '#FAFAFA',
     },
     typeContainer: {
          flexDirection: 'row',
     },
     typeBtn: {
          paddingVertical: 8,
          paddingHorizontal: 20,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#ddd',
          marginRight: 12,
          backgroundColor: '#fff',
     },
     typeBtnActive: {
          borderColor: Colors.primary,
          backgroundColor: Colors.primary,
     },
     typeText: {
          fontFamily: 'novaregular',
          fontSize: responsiveFontSize(1.7),
          color: '#666',
     },
     typeTextActive: {
          color: '#fff',
          fontFamily: 'novabold',
     },
     modalFooter: {
          padding: 20,
          borderTopWidth: 1,
          borderTopColor: '#eee',
     },
     saveBtn: {
          backgroundColor: Colors.primary,
          borderRadius: 10,
          paddingVertical: 15,
          alignItems: 'center',
     },
     saveBtnText: {
          fontFamily: 'novabold',
          fontSize: responsiveFontSize(2),
          color: '#fff',
     },
});