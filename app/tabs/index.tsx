import { StatusBar, } from 'expo-status-bar';
import { View, Text,Modal, StyleSheet, Image, Platform, NativeModules, ImageBackground, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { ImageSlider } from "react-native-image-slider-banner";
import { useEffect, useState } from 'react';
import { router } from 'expo-router';

const Home = () => {
  const { StatusBarManager } = NativeModules;
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
  const [data, setdata] = useState([])
  const [tabdata, settabdata] = useState([])
  const [autoplay, setautoplay] = useState(false)
  const [bgimage, setbgimage] = useState(null)
  const [modalVisible, setModalVisible] = useState(false);
  useEffect(() => {

    getbanner()
    gettabdata()

  }, [])

  const getbanner = async () => {
    let response = await fetch("https://irhealthcareservice.com/app_api/banner/fetch.php", {
      method: "POST",

    });

    let res = await response.json();
    setdata(res)
    console.log(res.att.timer)
    setautoplay(res.att.autoslide)
  }

  const gettabdata = async () => {
    let response = await fetch("https://irhealthcareservice.com/app_api/homepage/fetch.php", {
      method: "POST",

    });

    let res = await response.json();
    settabdata(res.tabs)
    setbgimage(res.background)
  }





  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View>
          <StatusBar backgroundColor='#fff' />
          {bgimage && <ImageBackground resizeMode='stretch' style={{ width: responsiveScreenWidth(100), height: responsiveScreenWidth(65), marginTop: STATUSBAR_HEIGHT, marginBottom: responsiveScreenWidth(14), justifyContent: 'center', paddingLeft: responsiveScreenWidth(5) }} source={{uri:bgimage}} >
            <Text style={{ fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(3), color: '#fff' }}>Pharmacy</Text>
            <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(4.5), color: '#fff' }}>Genune</Text>
            <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(4.5), color: '#fff' }}>And authentic</Text>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '95%', height: responsiveScreenWidth(28), position: 'absolute', bottom: -responsiveScreenWidth(14), alignSelf: 'center' }}>
              <TouchableOpacity onPress={()=>router.push('uploadprescriptions')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6f9', height: '75%', width: '47%', borderRadius: 12, justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.1), color: '#000' }}>Order with Prepscription</Text>
                <Image resizeMode='stretch' style={{ height: responsiveScreenWidth(9), width: responsiveScreenWidth(9) }} source={require('../../assets/images/homepage-con.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>router.push('orderconfirm')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6f9', height: '75%', width: '47%', borderRadius: 12, justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2.1), color: '#000' }}>Call to order Medicines</Text>
                <Image resizeMode='stretch' style={{ height: responsiveScreenWidth(9), width: responsiveScreenWidth(9) }} source={require('../../assets/images/homepage-cicon-2.png')} />
              </TouchableOpacity>
            </View>
          </ImageBackground>}

          <View style={{ marginTop: 25, height: '32%', }} >
            <ImageSlider
              preview={false}
              caroselImageStyle={{ resizeMode: 'stretch', height: responsiveScreenWidth(50), }}
              data={data?.banner}
              timer={data?.att?.timer}
              autoPlay={autoplay}
              onItemChanged={(item) => console.log("item", item)}
              activeIndicatorStyle={{ backgroundColor: '#555' }}
              indicatorContainerStyle={{ position: 'absolute', bottom: -60 }}

            />
          </View>


          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '96%', height: responsiveScreenWidth(32), alignSelf: 'center', marginBottom: responsiveScreenWidth(30) }}>
            {
              tabdata.map((item)=>
                <View style={{ backgroundColor: '#f1f2f6', height: '100%', width: '23.5%', borderRadius: 12, justifyContent: 'space-between', paddingHorizontal: 10 }}>

              <Image resizeMode='stretch' style={{ height: responsiveScreenWidth(9), width: responsiveScreenWidth(9), alignSelf: 'center', marginTop: 10 }} source={{uri:item.url}} />
              <Text numberOfLines={3} style={{ fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(2), color: '#000', marginBottom: 5 }}>{item.name}</Text>
            </View>
              )
            }
            
          
            
          </View>

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
        <View style={{flex:1,backgroundColor:'#000',opacity:.5}}>
         
        
        </View>
      </Modal>

    </View>
  );
}

export default Home
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});

