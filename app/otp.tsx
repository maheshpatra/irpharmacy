import { Pressable, StyleSheet, Text, View, StatusBar, Alert, ActivityIndicator,Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import instance from '../helper';

import Colors from "../constants/Colors";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { _storeData, _retrieveData } from '../local_storage';
import { path } from "../components/server";
import { responsiveFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
// import { StatusBar } from "expo-status-bar";

const otp = () => {
  const { mobile } = useLocalSearchParams()
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)


  const login = async () => {
    setLoading(true)
    const fd = new FormData();
    fd.append("mobile", mobile)
    fd.append("case", 'login')
    try {
      const req = await fetch(path + "login.php", {
        body: fd,
        method: 'post'
      })
      const res = await req.json();
      console.log(res)
      setLoading(false)

      if(res.error){
        Alert.alert('Login Error',res.message);
        return;
      }else if ( res.code === "NEW_USER") {
        navigation.navigate("signup", {
          mobile
        })
      } else if (res.code === "ALREADY_REGISTERED") {
        const KEY = 'USER_DATA'
        var data = new Object({ username: res.data.name, email: res.data.email, userid: res.data.id,  mobile: res.data.mobile})
        _storeData(KEY, data)
          .then(v => {
            if (v === "saved") {
                    setLoading(false)
                    router.replace('/tabs')
            }
          })
          .catch(err => console.log(err));
      }
    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle={'dark-content'} />
      <Image resizeMode="contain" source={require('../assets/images/otpicon.png')} style={{ height: responsiveScreenWidth(30), width: 100, position:'absolute',top:'10%',right:'5%' }} />
      <Text style={styles.subtitle}>Confirmation Code</Text>
      <Text style={[styles.text,]}>
       A 4 digit code has been sent to:{'\n'}
        {mobile}
      </Text>
      <Text onPress={() => router.back()} style={[styles.text1,{width:responsiveScreenWidth(17),marginBottom:20,
    borderBottomWidth:1,
    borderColor:'#333',fontFamily:'novaregular'}]}>Change</Text>
      <OtpInput
        theme={{
          pinCodeTextStyle: styles.pinCodeText,
          pinCodeContainerStyle: styles.pinCodeContainer
        }}
        numberOfDigits={4}
        focusColor={Colors.primary}
        
        focusStickBlinkingDuration={500}
        onTextChange={(text) => console.log(text)}
        onFilled={(text) => console.log(`OTP is ${text}`)}
      />
      
      <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 8,
            }}
            // disabled={!mobile && mobile?.length != 10}
            onPress={login}
          >
            {/* {loading ? (
              <ActivityIndicator />
            ) : ( */}
            <Text
              style={{  fontSize: responsiveFontSize(2.4), color: Colors.backgroundcolor,fontFamily:'novabold' }}
            >
              Verify
            </Text>
            {/* )} */}
          </TouchableOpacity>

      <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%',marginLeft:10 }}>
        <Text onPress={() => Alert.alert('Resend Code !', 'Are you sure you want to resend OTP')} style={[styles.text1,{color:Colors.primary,fontFamily:'novabold'}]}>Resend OTP</Text>
        
      </View>

      {/* <Link asChild href={"/signup"}> */}
      {/* {loading?<Pressable style={styles.button} android_ripple={styles.ripple} >
        <ActivityIndicator size={'small'} color={Colors.primary} />
      </Pressable>:
      <Pressable style={styles.button} android_ripple={styles.ripple} onPress={login}>
        <AntDesign name="doubleright" size={30} color={Colors.primary} />
      </Pressable>} */}
      {/* </Link> */}
    </View>
  );
};

export default otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    columnGap: 10,
    rowGap: 10,
    padding: 20,
    backgroundColor:'#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: responsiveFontSize(3),
    fontFamily:'novabold',
    color: '#555'
  },
  text: {
    fontSize: responsiveFontSize(2),
    color: '#555',
    fontFamily:'novaregular'
  },
  text1: {
    fontSize: 17,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderWidth: 0.5,
    borderColor: Colors.light.text,
    padding: 10,
    borderRadius: 4,
    width: "90%",
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  ripple: {
    color: Colors.light.background,
  },
  button: {
    position: "absolute",
    right: 25,
    bottom: 20,
  },
  pinCodeText: {
    color: '#555',
    fontFamily:'novabold'
  }
  ,pinCodeContainer:{
    width:responsiveScreenWidth(18),
    height:responsiveScreenWidth(18),
    borderColor:'#555'
  }
});
