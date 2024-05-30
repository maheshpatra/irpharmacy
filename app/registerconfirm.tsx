import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Linking,Dimensions
} from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome, Octicons } from "@expo/vector-icons";
import { Checkbox, TextInput } from "react-native-paper";
import { Link } from "expo-router";
import Animation from "../components/Animation";
import HeaderAB from "../components/HeaderAB";


const ts = Dimensions.get('screen').width /100 
const RegisterConfirm = () => {
  console.log("RegisterConfirm");

  const openYouTubeVideo = () => {
    // Replace this URL with your actual YouTube video URL
    const youtubeVideoURL = "https://youtu.be/Y8poQgMK-VQ?si=14klAc9GBOHrAVNy";

    Linking.openURL(youtubeVideoURL)
      .then((supported) => {
        if (!supported) {
          console.error("Can't handle the URL: " + youtubeVideoURL);
        } else {
          return Linking.openURL(youtubeVideoURL);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <HeaderAB title={'Confirm'} />
      <Animation style={{alignSelf:'center',marginTop:50}}  height={ts*40} width={ts*40} autoplay={true} loop={true} url={require('../assets/animation/tick.json')} />
      <View style={{ padding: 40 }}>
        <Text style={styles.title}>Thank for Register</Text>
        <Text style={styles.title2}>
          Quiz is Scheduled on 02 feb 2024 at 08 : 00 pm
        </Text>
        <Text style={styles.title2}>
          Click here for study material and youtube video links related to quiz
          preparetion.
        </Text>
      </View>
      <View style={styles.subView}>
        <Link asChild href={'./quesans'}>
        <Pressable style={styles.buttonView2}>
          <Text style={[styles.title, { color: "white" }]}>PDF</Text>
        </Pressable>
        </Link>
        
        <View style={{ flex: 1 }} />
        <Pressable style={styles.buttonView2} onPress={openYouTubeVideo}>
          <Text style={[styles.title, { color: "white" }]}>Youtube</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default RegisterConfirm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    width: "100%",
    backgroundColor:Colors.backgroundcolor
  },
  buttonView: {
    width: "95%",
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  buttonView2: {
    width: "35%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "#2f95dc",
    borderRadius: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    textAlign: "center",
  },
  title2: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginVertical: 15,
  },
  title3: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000",
  },
  subView: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 40, // Added padding to the sides
    marginTop: 20,
  },
  subView2: {
    flexDirection: "row",
    alignItems: "center",
  },

  ripple: {
    color: Colors.light.background,
  },
});
