import { View, Text, TouchableOpacity, Image, Modal, Alert, ScrollView, FlatList } from 'react-native'
import React, { useState } from 'react'
import Header from '../components/Header'
import HeaderAB from '../components/HeaderAB'
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors'
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Fontisto from '@expo/vector-icons/Fontisto';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router'
export default function UploadPrescriptions() {

  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);
  const [selecttype, setSelectType] = useState(1);

  const mydata = [
    {
      id:1,
      name: 'Order everything from the prescription',
      type: 'Instant Order',
      desc: 'Our Phrmacist will call you and arrange your order - the waiting time is 4-5 min'
    },
    {
      id:2,
      name: 'Manual order with digitalized Prescription',
      type: 'Digitalized Order',
      desc: 'Manually select the medicines and quantity and place order according to your need Digitization time 1-2 hours'
    }
  ]
  const pickCamera = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false)
    }
  };
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setModalVisible(false)
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <HeaderAB title={''} />
      <ScrollView>
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <Text style={{ fontWeight: "bold", fontSize: responsiveScreenFontSize(2.3), color: '#333' }}>Upload Prescriptions</Text>
          <Text style={{ fontSize: responsiveScreenFontSize(2), color: '#333' }}>and let us arrange your medicines for you</Text>

          {!image ? <Image resizeMode='stretch' source={require('../assets/images/uploadpresctipn.png')} style={{ height: responsiveScreenWidth(40), width: responsiveScreenWidth(40), alignSelf: 'center', marginVertical: responsiveScreenWidth(10) }} />
            :
            <View style={{ height: responsiveScreenWidth(55), width: responsiveScreenWidth(40), alignSelf: 'center', marginTop: responsiveScreenWidth(10) }}>
              <Image resizeMode='stretch' source={{ uri: image }} style={{ height: responsiveScreenWidth(55), width: responsiveScreenWidth(40), alignSelf: 'center', }} />
              <AntDesign onPress={() => setImage(null)} name='close' size={20} color={'#fff'} style={{ position: 'absolute', top: 5, right: 5, borderRadius: 20, padding: 5, backgroundColor: '#3a3b3d', elevation: 10 }} />
            </View>
          }
          {image &&

            <View style={{ width: '100%', height: '100%' }}>

              <Text style={{ alignSelf: 'center', color: 'green', fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), marginTop: 10, }}>Upload More Prescription</Text>
              <View style={{ width: '100%', borderTopWidth: 5, borderColor: '#ddd', marginTop: 10 }}>
              </View>
              <Text style={{ color: '#333', fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.4), marginTop: 10, }}>How would you like us to process your Recquest ?</Text>
              <View style={{height:responsiveScreenWidth(70)}}>
                <FlatList
                data={mydata}
                renderItem={({ item, index }) =>
                  <TouchableOpacity onPress={()=>setSelectType(item.id)} style={{ height: responsiveScreenWidth(30), width: '100%', alignSelf: 'center', borderWidth: 1.5, borderRadius: 6, borderColor: '#ddd', marginTop: 15, flexDirection: 'row', alignItems: 'center' }}>
                    <Fontisto name={item.id==selecttype?'radio-btn-active':'radio-btn-passive'} size={responsiveScreenFontSize(3)} color={item.id==selecttype?'green':'#ccc'} style={{ marginLeft: 15 }} />
                    <View style={{ marginLeft: 15, width: '70%' }}>
                      <Text style={{ color: '#333', fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.1), }}>{item.name}<Text style={{ color: 'green', fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.1), marginTop: 10, }}>{'- ' + item.type}</Text></Text>
                      <Text style={{ color: '#333', fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(1.7), }}>{item.desc}</Text>
                    </View>
                    <Image resizeMode='stretch' source={require('../assets/images/homepage-con.png')} style={{ height: responsiveScreenWidth(8), width: responsiveScreenWidth(8), marginLeft: 10 }} />


                  </TouchableOpacity>

                }
              />
              </View>
              <Text style={{ color: '#555', fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(1.7), }}>Your  Assigned pharmasist will make the following selection:</Text>
              <Text style={{lineHeight:25, color: '#333', fontFamily: 'novabold', fontSize: responsiveScreenFontSize(1.6), }}><FontAwesome   name='circle' size={responsiveScreenFontSize(2)} color={'green'} style={{  }} /> Add medicines  <FontAwesome   name='circle' size={responsiveScreenFontSize(2)} color={'green'} style={{  }} /> Apply best discount  <FontAwesome   name='circle' size={responsiveScreenFontSize(2)} color={'green'} style={{  }} /> Delivery Time  <FontAwesome   name='circle' size={responsiveScreenFontSize(2)} color={'green'} style={{  }} /> Delivery Address</Text>
              <TouchableOpacity
                style={{
                  height: 50,marginBottom:15,
                  backgroundColor: Colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 10,
                  borderRadius: 6,
                  width: '100%'
                }}
                onPress={() => {router.push('/tabs/prescription'); }}
              >

                <Text
                  style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.3), color: Colors.backgroundcolor }}
                >
                  Place medicine recquest
                </Text>

              </TouchableOpacity>
            </View>


          }

          {!image && <View>
            <TouchableOpacity
              style={{
                height: 50,
                backgroundColor: Colors.primary,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 10,
                borderRadius: 6,
              }}
              // disabled={!mobile && mobile?.length != 10}
              onPress={() => { setModalVisible(true) }}
            >
              <Text
                style={{ fontWeight: "bold", fontSize: responsiveScreenFontSize(2), color: Colors.backgroundcolor }}
              >
                Upload Prescription
              </Text>
              {/* )} */}
            </TouchableOpacity>
            <Text style={{ fontFamily: 'novaregular', marginTop: 20, fontSize: responsiveScreenFontSize(2), color: '#333' }}>All prepscription are encrypted & visible only to our pharamasist. Any prepscription you upload is validate before processing the order</Text>

            <Text style={{ fontFamily: 'novaregular', marginTop: 20, fontSize: responsiveScreenFontSize(2), }}>What is valid prescription ?</Text>
          </View>}
        </View>

      </ScrollView>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={{ flex: 1, backgroundColor: '#000', opacity: .9 }}>
          <View style={{ position: 'absolute', bottom: 0, height: responsiveScreenWidth(60), backgroundColor: '#fff', width: '100%' }}>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', height: responsiveScreenWidth(15), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#555', fontFamily: 'novabold', marginLeft: 20, fontSize: responsiveScreenFontSize(2.3) }}>Upload Prescription</Text>
              <AntDesign onPress={() => setModalVisible(false)} style={{ marginRight: 20, padding: 5 }} size={responsiveScreenFontSize(2.3)} name="close" color={'#555'} />
            </View>
            <TouchableOpacity onPress={pickCamera} style={{ height: responsiveScreenWidth(15), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#555', fontFamily: 'novabold', marginLeft: 20, fontSize: responsiveScreenFontSize(2.3) }}><FontAwesome style={{}} size={responsiveScreenFontSize(2.3)} name="camera" color={'#555'} />  Take A Photo</Text>
              <AntDesign style={{ marginRight: 20, padding: 5 }} size={responsiveScreenFontSize(2.3)} name="right" color={'#555'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} style={{ height: responsiveScreenWidth(15), width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ color: '#555', fontFamily: 'novabold', marginLeft: 15, fontSize: responsiveScreenFontSize(2.3) }}> <FontAwesome style={{}} size={responsiveScreenFontSize(2.3)} name="photo" color={'#555'} />  Choose From Gallery</Text>
              <AntDesign style={{ marginRight: 20, padding: 5 }} size={responsiveScreenFontSize(2.3)} name="right" color={'#555'} />
            </TouchableOpacity>
          </View>

        </View>
      </Modal>
    </View>
  )
}