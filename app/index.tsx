import { Image, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { Link, router } from "expo-router";
import { _retrieveData } from "../local_storage";
import NetInfo from '@react-native-community/netinfo';
import NoInternetModal from '../components/NoInternet';
import { useNetworkStatus } from '../components/Network';
import { responsiveFontSize } from "react-native-responsive-dimensions";
const index = () => {
  const [verification, setVerification] = useState(true)
  const isConnected = useNetworkStatus();
  const gotopage = () => {

  }

  useEffect(() => {

    _retrieveData("USER_DATA").then((userdata) => {
      console.log(userdata);
      if (userdata && userdata !== 'error') {
        setVerification(false);
        setTimeout(() => {
          // write your functions    
          router.replace('/home')
        }, 3000);


      } else {
        setTimeout(() => {
          // write your functions    
          router.replace('/login')
        }, 3000);
        
      }

    });
  }, [])


  const ts = Dimensions.get('screen').width / 100
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo.png')} style={{ height: ts * 50, width: ts * 50, alignSelf: 'center' }} />
      
      <Text style={styles.subtitle}>Affordable Health Care</Text>

      <NoInternetModal visible={!isConnected} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    rowGap: 10,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: responsiveFontSize(3),
    fontWeight: "bold",
    color: Colors.primary
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: '#555'
  },
  button: {
    position: "absolute",
    bottom: "5%",
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    padding: 10,
    borderRadius: 20,
    alignItems: 'center',
    flexDirection: 'row',
    height: 50
  },
  ripple: {
    color: Colors.light.background,
  },
});
