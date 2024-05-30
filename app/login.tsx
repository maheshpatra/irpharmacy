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

const login = () => {
  const [mobile, setMobile] = useState();
  const [pass, setPass] = useState(null);
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: Colors.backgroundcolor,
        paddingTop: "30%",
        paddingHorizontal: 12
      }}
    >

      <StatusBar barStyle={'light-content'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{

        }}
      >
        <Image source={require('../assets/images/logo.png')} style={{ height: 200, width: 200, alignSelf: 'center' }} />
        <Text style={{ alignSelf: "center", fontWeight: "bold", fontSize: 26, marginTop: 20, color: '#33D3AF' }}>
          Welcome Back!
        </Text>
        <Text
          style={{ alignSelf: "center", fontWeight: "normal", fontSize: 19, color: '#fff' }}
        >
          Please enter your mobile number below
        </Text>

        <View style={{ marginTop: '15%' }}>
          <View style={{ marginTop: 10 }}>
            <View style={styles.inputContainer}>
              <Text style={{ paddingLeft: 15, color: '#fff', fontSize: 17 }}> +91</Text>
              <TextInput
                value={mobile}
                keyboardType="number-pad"
                onChangeText={(txt) => setMobile(txt)}
                placeholder="Mobile Number"
                style={styles.inputfild}
                placeholderTextColor={'#ddd'}
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
              marginTop: 20,
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
              style={{ fontWeight: "bold", fontSize: 20, color: Colors.backgroundcolor }}
            >
              Continue
            </Text>
            {/* )} */}
          </TouchableOpacity>



          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
            <Text style={{ color: "#CCC", marginHorizontal: 10 }}>Or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 20,
            }}
          >

            <TouchableOpacity>
              <FontAwesome name="google" size={30} color="red" />
            </TouchableOpacity>

          </View>
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
    color: '#fff',
    width: "70%",
    fontSize: 17
  },
  inputfildLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },
});
