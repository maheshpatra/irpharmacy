import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  ActivityIndicator,
  StatusBar,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Entypo, FontAwesome, Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Link, router, useNavigation } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { responsiveFontSize, responsiveScreenWidth } from "react-native-responsive-dimensions";

const login = () => {
  const [mobile, setMobile] = useState();
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: Colors.backgroundcolor,
        paddingTop: "20%",
        paddingHorizontal: responsiveScreenWidth(2.5)
      }}
    >

      <StatusBar barStyle={'dark-content'}  />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{

        }}
      >
        <Image source={require('../assets/images/logo.png')} style={{ height: 60, width: 100, position:'absolute',top:0,right:0 }} />
        <Image source={require('../assets/images/loginpage-icon.png')} style={{ height: 200, width: 200, alignSelf: 'center',marginTop:responsiveScreenWidth(20) }} />
        {/* <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 26, marginTop: 20, color: '#33D3AF' }}>
          Welcome Back!
        </Text> */}
        <Text
          style={{marginTop: '5%', alignSelf: "flex-start", fontSize: responsiveFontSize(2.3), color: '#000',fontFamily:'novabold' }}
        >
          Sign in to Continue
        </Text>

        <View style={{ marginTop: '5%',  }}>
          <View style={{ marginTop: 10 }}>
            <View style={styles.inputContainer}>
              <Text style={{ paddingLeft: 15, color: '#999', fontSize: responsiveFontSize(2),fontFamily:'novaregular' }}> +91</Text>
              <TextInput
                
                value={mobile}
                keyboardType="number-pad"
                onChangeText={(txt) => setMobile(txt)}
                placeholder="Mobile Number"
                style={styles.inputfild}
                placeholderTextColor={'#ccc'}
                maxLength={10}
              />
              <Entypo
                style={styles.inputIcon}
                name="phone"
                size={17}
                color="#fff"
              />
            </View>
            <Text style={styles.errTextStyle}>{ }</Text>
          </View>





          <TouchableOpacity
            style={{
              height: 50,
              backgroundColor: Colors.primary,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 10,
              borderRadius: 12,
            }}
            // disabled={!mobile && mobile?.length != 10}
            onPress={() => {
              if (!mobile || mobile?.length < 10) {
                alert("Please Enter a correct number")
                return;
              }
              navigation.navigate("otp", {
                mobile: mobile
              })
            }}
          >
            {/* {loading ? (
              <ActivityIndicator />
            ) : ( */}
            <Text
              style={{ fontFamily:'novabold', fontSize: responsiveFontSize(2.3), color: Colors.backgroundcolor }}
            >
              Get verification code
            </Text>
            {/* )} */}
          </TouchableOpacity>


          <Text
              style={{alignSelf:'center', fontFamily:'novabold', fontSize: responsiveFontSize(2), color: Colors.primary,marginTop:responsiveScreenWidth(7) }}
            >
             Sign in with email
            </Text>
            <Text
              style={{fontFamily:'novaregular',alignSelf:'center',  fontSize: responsiveFontSize(2), color: '#555',marginTop:responsiveScreenWidth(5),borderBottomWidth:1 }}
            >
             Have a referral code?
            </Text>
            <Text
              style={{fontFamily:'novaregular',alignSelf:'center',  fontSize: responsiveFontSize(1.6), color: '#555',marginTop:responsiveScreenWidth(5),}}
            >
             By Sign in you agree to our 
            </Text>
            <Text
              style={{fontFamily:'novaregular',alignSelf:'center',  fontSize: responsiveFontSize(1.6), color: '#555',marginBottom:responsiveScreenWidth(4),borderBottomWidth:1 }}
            >
             Terms & conditions  <Text
              style={{alignSelf:'center',  fontSize: responsiveFontSize(1.6), color: '#555',marginBottom:responsiveScreenWidth(4),borderBottomWidth:0 }}
            >
             and  
            </Text> Privacy policy 
            </Text>



          

          
        </View>
      </ScrollView>
    </View>
  );
};

export default login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    rowGap: 16,
    padding: 16,
  },
  social: {
    borderRadius: 20,
    size: 30,
    padding: 5,
    margin: 8,
    alignSelf: "center",
  },
  inputContainer: {
    backgroundColor: Colors.backgroundcolor,
    borderRadius: 12,
    borderWidth: 1.5,
    height: 55,
    borderColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errTextStyle: {
    color: Colors.light.red,
  },
  inputIcon: {
    marginRight: 20,
  },
  inputfild: {
    paddingLeft: 10,
    height: 50,
    borderColor: "#ccc",
    color: '#555',
    width: "70%",
    fontSize: responsiveFontSize(2),
    fontFamily:'novaregular'
  },
  inputfildLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
