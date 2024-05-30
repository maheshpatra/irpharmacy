import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import UpComingQuiz from "./upcomingquiz";
import UnlockQuest from "./unlockquest";
import Header from "../components/Header";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Sidebar from "../components/Sidebar";
import Colors from "../constants/Colors";
import Leaderboard from "./leaderboard";
import { router } from "expo-router";

import PagerView from "react-native-pager-view";
const Tab = createMaterialTopTabNavigator();

export default function Home() {
  const [show, setShow] = useState(false);
  const [activetab, setactivetab] = useState("Quizomaire");
  const menuClick = () => {
    setShow(!show);
  };
  const [isAvailable, setIsAvailable] = React.useState(false);
  const toggleSwitch = () => setIsAvailable((previousState) => !previousState);
  const Tabs = ["Quizomaire", "My Pools", "Channels"];
  const [selectedTab, setSelctedTab] = React.useState(0);
  const pagerRef = React.useRef(null);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bglight }}>
      <StatusBar
        backgroundColor={Colors.backgroundcolor}
        barStyle={"light-content"}
      />
      <Header menuClicks={menuClick} title={"Quizing"} />
      <Sidebar setshow={setShow} show={show} />
      <View
        style={{
          width: "92%",
          height: 45,
          backgroundColor: "#d6d6ff",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: 10,
          alignSelf: "center",
          borderRadius: 15,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            pagerRef?.current?.setPage(0);
            setSelctedTab(0);
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "33%",
            backgroundColor:
              selectedTab === 0 ? Colors.backgroundcolor : "#d6d6ff",
            height: 45,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              color: selectedTab === 0 ? "#fff" : "#000",
              fontWeight: selectedTab === 0 ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Quizomaire
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            pagerRef?.current?.setPage(1);
            setSelctedTab(1);
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "33%",
            backgroundColor:
              selectedTab === 1 ? Colors.backgroundcolor : "#d6d6ff",
            height: 45,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              color: selectedTab === 1 ? "#fff" : "#000",
              fontWeight: selectedTab === 1 ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            My Pools
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            pagerRef?.current?.setPage(2);
            setSelctedTab(2);
          }}
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "33%",
            backgroundColor:
              selectedTab === 2 ? Colors.backgroundcolor : "#d6d6ff",
            height: 45,
            borderRadius: 15,
          }}
        >
          <Text
            style={{
              color: selectedTab === 2 ? "#fff" : "#000",
              fontWeight: selectedTab === 2 ? "bold" : "normal",
              fontSize: 16,
            }}
          >
            Channels
          </Text>
        </TouchableOpacity>
      </View>

      <PagerView
        style={styles.pagerView}
        initialPage={0}
        ref={pagerRef}
        onPageSelected={(event) => {
          setSelctedTab(event?.nativeEvent?.position);
        }}
      >
        <View key="1">
          <View>
            <View>
              <TouchableOpacity
                onPress={() => router.push("/upcomingquiz")}
                style={{
                  height: 120,
                  width: "92%",
                  alignSelf: "center",
                  backgroundColor: "#fff",
                  marginTop: 20,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: Colors.backgroundcolor,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    color: Colors.backgroundcolor,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Unlock Quest
                </Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => router.push("/unlockquest")}
                style={{
                  height: 120,
                  width: "92%",
                  alignSelf: "center",
                  backgroundColor: "#fff",
                  marginTop: 20,
                  borderRadius: 20,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 2,
                  borderColor: Colors.backgroundcolor,
                  elevation: 5,
                }}
              >
                <Text
                  style={{
                    color: Colors.backgroundcolor,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Examination Series
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View key="2">
          <Leaderboard />
        </View>
        <View key="3">
          <View style={{justifyContent:'center',alignItems:'center'}}></View>
          <Text style={{alignSelf:'center',marginTop:50}}>My Channel</Text>
        </View>
      </PagerView>

      {/* {activetab === 'Quizomaire' ?
        <View>


          <View>
            <TouchableOpacity onPress={() => router.push('/upcomingquiz')} style={{ height: 120, width: '92%', alignSelf: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.backgroundcolor, elevation: 5 }}>
              <Text style={{ color: Colors.backgroundcolor, fontSize: 20, fontWeight: 'bold' }}>Unlock Quest</Text>

            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity onPress={() => router.push('/unlockquest')} style={{ height: 120, width: '92%', alignSelf: 'center', backgroundColor: '#fff', marginTop: 20, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.backgroundcolor, elevation: 5 }}>
              <Text style={{ color: Colors.backgroundcolor, fontSize: 20, fontWeight: 'bold' }}>Examination Series</Text>

            </TouchableOpacity>
          </View>
        </View>

        :
        <Leaderboard />
      } */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
  },
});
