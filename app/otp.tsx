import { Pressable, StyleSheet, Text, View, StatusBar, Alert, ActivityIndicator, Image, TouchableOpacity, ToastAndroid } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import instance from '../helper';

import Colors from "../constants/Colors";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { AntDesign, FontAwesome } from "@expo/vector-icons";

import { _storeData, _retrieveData } from '../local_storage';
import { path } from "../components/server";
import { responsiveFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { StatusBar } from "expo-status-bar";

const otp = () => {
  const { mobile,newuser } = useLocalSearchParams()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const statusBarHeight = insets.top;

  const verify = async (mob, p) => {
    if(p.length < 3){
      ToastAndroid.show('Require 4 Digit OTP', ToastAndroid.SHORT);
      return
    }
    setLoading(true)
    console.log(newuser)
    try {
      let headersList = {
        "Accept": "*/*"
      }

      let bodyContent = new FormData();
      bodyContent.append("action", "verify_otp");
      bodyContent.append("mobile", mob);
      bodyContent.append("otp", p);

      let response = await fetch(path + "login.php", {
        method: "POST",
        body: bodyContent,
        headers: headersList
      });

      let data = await response.json();
      console.log(data)
      if (data.status === 'error') {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      } else if (data.status === 'success') {
        if (newuser) {
          navigation.navigate("signup", { mobile: mob })
        } else {
          const KEY = 'USER_DATA'
          var udata = new Object({ username: data.data.name, userid: data.data.id, mobile: data.data.mobile })
          console.log(udata)
          _storeData(KEY, udata)
            .then(v => {
              if (v === "saved") {
                setLoading(false)
                router.replace('/tabs')
              }
            })
            .catch(err => console.log(err));
      }
      console.log(data)
      ToastAndroid.show(data.message, ToastAndroid.SHORT);
    }
    } catch (err) {
    console.log(JSON.stringify(err, null, 2));
  } finally {
    setLoading(false)
  }
}

return (
  <View style={styles.container}>
    <StatusBar barStyle={'dark-content'} />
    <FontAwesome onPress={() => {
      router.back()
    }} name="chevron-left" color={'#333'} size={responsiveFontSize(2.5)} style={{ position: 'absolute', top: statusBarHeight + 20, left: responsiveScreenWidth(2.5), padding: 10, borderRadius: 20 }} />
    <Image resizeMode="contain" source={require('../assets/images/otpicon.png')} style={{ height: responsiveScreenWidth(30), width: 100, position: 'absolute', top: '10%', right: '5%' }} />
    <Text style={styles.subtitle}>Confirmation Code</Text>
    <Text style={[styles.text,]}>
      A 4 digit code has been sent to:{'\n'}
      {mobile}
    </Text>
    <Text onPress={() => router.back()} style={[styles.text1, {
      width: responsiveScreenWidth(17), marginBottom: 20,
      borderBottomWidth: 1,
      borderColor: '#333', fontFamily: 'novaregular'
    }]}>Change</Text>
    <OtpInput
      theme={{
        pinCodeTextStyle: styles.pinCodeText,
        pinCodeContainerStyle: styles.pinCodeContainer
      }}
      numberOfDigits={4}
      focusColor={Colors.primary}
      focusStickBlinkingDuration={500}
      onTextChange={(text) => setOtp(text)}
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
      onPress={() => verify(mobile, otp)}
    >
      {loading ? (
        <ActivityIndicator color={'#fff'} />
      ) : (
        <Text
          style={{ fontSize: responsiveFontSize(2.4), color: Colors.backgroundcolor, fontFamily: 'novabold' }}
        >
          Verify
        </Text>
      )}
    </TouchableOpacity>

    <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%', marginLeft: 10 }}>
      <Text onPress={() => Alert.alert('Resend Code !', 'Are you sure you want to resend OTP')} style={[styles.text1, { color: Colors.primary, fontFamily: 'novabold' }]}>Resend OTP</Text>

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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: responsiveFontSize(3),
    fontFamily: 'novabold',
    color: '#555'
  },
  text: {
    fontSize: responsiveFontSize(2),
    color: '#555',
    fontFamily: 'novaregular'
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
    fontFamily: 'novabold'
  }
  , pinCodeContainer: {
    width: responsiveScreenWidth(18),
    height: responsiveScreenWidth(18),
    borderColor: '#555'
  }
});
