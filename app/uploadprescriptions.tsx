import { View, Text,TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Header from '../components/Header'
import HeaderAB from '../components/HeaderAB'
import { responsiveScreenFontSize, responsiveScreenWidth } from 'react-native-responsive-dimensions'
import Colors from '../constants/Colors'

export default function UploadPrescriptions() {
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
      <HeaderAB title={''} />
      <View style={{width:'90%',alignSelf:'center'}}>
      <Text style={{fontWeight: "bold", fontSize: responsiveScreenFontSize(2.3),color:'#333'}}>Upload Prescriptions</Text>
      <Text style={{ fontSize: responsiveScreenFontSize(2),color:'#333'}}>and let us arrange your medicines for you</Text>

      <Image resizeMode='stretch' source={require('../assets/images/uploadpresctipn.png')} style={{height:responsiveScreenWidth(40),width:responsiveScreenWidth(40),alignSelf:'center',marginVertical:responsiveScreenWidth(10)}} />

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
            onPress={() => {}}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: responsiveScreenFontSize(2), color: Colors.backgroundcolor }}
            >
              Upload Prescription
            </Text>
            {/* )} */}
          </TouchableOpacity>
          <Text style={{fontFamily:'novaregular',marginTop:20, fontSize: responsiveScreenFontSize(2),color:'#333'}}>All prepscription are encrypted & visible only to our pharamasist. Any prepscription you upload is validate before processing the order</Text>

      <Text style={{fontFamily:'novaregular',marginTop:20, fontSize: responsiveScreenFontSize(2),}}>What is valid prescription ?</Text>
      </View>
    </View>
  )
}