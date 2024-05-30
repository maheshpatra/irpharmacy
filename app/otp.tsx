import { Pressable, StyleSheet, Text, View, StatusBar, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { OtpInput } from "react-native-otp-entry";
import instance from '../helper';

import Colors from "../constants/Colors";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import { AntDesign } from "@expo/vector-icons";

import { _storeData, _retrieveData } from '../local_storage';
import { path } from "../components/server";
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
      }else if ( res.code === "USER_NOT_REGISTERED") {
        navigation.navigate("signup", {
          mobile
        })
      } else if (res.code === "USER_REGISTERED") {
        const KEY = 'USER_DATA'
        var data = new Object({ username: res.data.name, email: res.data.email, userid: res.data.id, profile: res.data.image, mobile: res.data.mobile,address:res.data.address,password:res.data.password,dob:res.data.dob,gender:res.data.gender})
        _storeData(KEY, data)
          .then(v => {
            var datab = new Object({ refer_code: res.data.refer_code })
            if (v === "saved") {
              _storeData('ReferCode', datab)
                .then(c => {
                  if (c === "saved") {
                    console.log(c)
                    setLoading(false)
                    router.replace('/home')
                  }
                })
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
      <StatusBar barStyle={'light-content'} />
      <Text style={styles.subtitle}>Confirmation Code</Text>
      <OtpInput
        theme={{
          pinCodeTextStyle: styles.pinCodeText,
        }}
        numberOfDigits={6}
        focusColor="white"
        focusStickBlinkingDuration={500}
        onTextChange={(text) => console.log(text)}
        onFilled={(text) => console.log(`OTP is ${text}`)}
      />
      <Text style={[styles.text, { marginTop: 20 }]}>
        We have sent an sms with an activation code to your phone number. +91
        {mobile}
      </Text>

      <View style={{ marginTop: 20, alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', width: '100%' }}>
        <Text onPress={() => Alert.alert('Resend Code !', 'Are you sure you want to resend OTP')} style={styles.text1}>Didn't receive the code?</Text>
        <Text onPress={() => router.back()} style={styles.text1}>Change Mobile No</Text>
      </View>

      {/* <Link asChild href={"/signup"}> */}
      {loading?<Pressable style={styles.button} android_ripple={styles.ripple} >
        <ActivityIndicator size={'small'} color={Colors.primary} />
      </Pressable>:
      <Pressable style={styles.button} android_ripple={styles.ripple} onPress={login}>
        <AntDesign name="doubleright" size={30} color={Colors.primary} />
      </Pressable>}
      {/* </Link> */}
    </View>
  );
};

export default otp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    columnGap: 10,
    rowGap: 10,
    padding: 20,
    backgroundColor: Colors.backgroundcolor,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 20,
    color: '#fff'
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  text1: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  input: {
    borderWidth: 0.5,
    borderColor: Colors.light.text,
    padding: 10,
    borderRadius: 10,
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
    color: '#fff'
  }
});
