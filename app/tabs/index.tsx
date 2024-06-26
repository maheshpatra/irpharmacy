import { StatusBar, } from 'expo-status-bar';
import { View, Text, Dimensions, StyleSheet, Linking, Image, Platform, NativeModules, ImageBackground, ScrollView, TouchableOpacity, Alert, FlatList } from 'react-native';
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions';
import { ImageSlider } from "react-native-image-slider-banner";
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import Carousel from 'react-native-reanimated-carousel';
const Home = () => {
  const { StatusBarManager } = NativeModules;
  const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBarManager.HEIGHT;
  const [data, setdata] = useState([])
  const [tabdata, settabdata] = useState([])
  const [autoplay, setautoplay] = useState(false)
  const [bgimage, setbgimage] = useState(null)
  useEffect(() => {

    getbanner()
    gettabdata()

  }, [])

  const brandImages = [
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-1.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-2.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-3.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-4.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-5.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-6.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-7.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-8.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-9.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-10.jpg",
    "https://irhealthcareservice.com/landing/assets/images/brand-logo/brand-logo-11.jpg"
  ];


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

  const width = Dimensions.get('window').width;



  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} >
        <View>
          <StatusBar backgroundColor='#fff' style='dark' />
          {bgimage && <ImageBackground resizeMode='stretch' style={{ width: responsiveScreenWidth(100), height: responsiveScreenWidth(65), marginTop: STATUSBAR_HEIGHT, marginBottom: responsiveScreenWidth(14), justifyContent: 'center', paddingLeft: responsiveScreenWidth(5) }} source={{ uri: bgimage }} >
            <Text style={{ fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(3), color: '#fff' }}>Pharmacy</Text>
            <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(4.5), color: '#fff' }}>Genuine</Text>
            <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(4.5), color: '#fff' }}>And authentic</Text>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '95%', height: responsiveScreenWidth(28), position: 'absolute', bottom: -responsiveScreenWidth(14), alignSelf: 'center' }}>
              <TouchableOpacity onPress={() => router.push('uploadprescriptions')} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6f9', height: '75%', width: '47%', borderRadius: 12, justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: '#000' }}>Order with Prepscription</Text>
                <Image resizeMode='cover' style={{ height: responsiveScreenWidth(10.5), width: responsiveScreenWidth(9) }} source={require('../../assets/images/homepage-con.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => Linking.openURL(`tel:${'8167553353'}`)} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#f4f6f9', height: '75%', width: '47%', borderRadius: 12, justifyContent: 'space-between', paddingHorizontal: 10 }}>
                <Text style={{ fontFamily: 'novabold', fontSize: responsiveScreenFontSize(2), color: '#000' }}>Call to order Medicines</Text>
                <Image resizeMode='cover' style={{ height: responsiveScreenWidth(10.5), width: responsiveScreenWidth(9) }} source={require('../../assets/images/homepage-cicon-2.png')} />
              </TouchableOpacity>
            </View>
          </ImageBackground>}

          <View style={{ marginTop: 12, height: '20%', }} >
            <Carousel
              loop
              width={width}
              height={width / 2}
              autoPlay={autoplay}
              mode='parallax'
              data={data?.banner}
              snapEnabled
              scrollAnimationDuration={data?.att?.timer}
              // onSnapToItem={(index) => console.log('current index:', index)}
              renderItem={({ index, item }) => (
                <View
                  style={{
                    width: '100%', height: responsiveScreenWidth(52),
                    justifyContent: 'center',
                    alignSelf: 'center', borderRadius: 10
                  }}
                >
                  <Image resizeMode='stretch' style={{ borderRadius: 15, height: '100%', width: responsiveScreenWidth(96) }} source={{ uri: item.img }} />

                </View>
              )}
            />
          </View>


          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '96%', height: responsiveScreenWidth(32), alignSelf: 'center', marginTop: responsiveScreenWidth(3) }}>
            {
              tabdata.map((item) =>
                <View style={{ backgroundColor: '#f1f2f6', height: '100%', width: '23.5%', borderRadius: 12, justifyContent: 'space-between', paddingHorizontal: 10 }}>

                  <Image resizeMode='contain' style={{ height: responsiveScreenWidth(10), width: responsiveScreenWidth(11), alignSelf: 'center', marginTop: 10 }} source={{ uri: item.url }} />
                  <Text numberOfLines={3} style={{ fontFamily: 'novaregular', fontSize: responsiveScreenFontSize(2), color: '#000', marginBottom: 5 }}>{item.name}</Text>
                </View>
              )
            }



          </View>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', width: '90%', alignSelf: 'center', marginBottom: responsiveScreenWidth(16), marginTop:'8%' }}>
            <FlatList
              data={brandImages}
              contentContainerStyle={{alignSelf:'center',justifyContent:'space-between'}}
              renderItem={({ item }) =>
              

                <Image resizeMode='contain' style={{ height: responsiveScreenWidth(20), width: '30%', alignSelf: 'center',marginLeft:responsiveScreenWidth(2.5)  }} source={{ uri: item }} />

              }
              numColumns={3}
            />


          </View>


        </View>
      </ScrollView>


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

