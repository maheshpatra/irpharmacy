import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import Colors from "../constants/Colors";
import { path } from "../components/server";

import HeaderAB from "../components/HeaderAB";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import StateComp from "../components/SubjectComp";

const width1 = Dimensions.get("window").width;

const UpComingQuiz = () => {
  const [statedata, setstatedata] = useState([]);
  const [loading, setLoading] = useState(true);


  const Tabs = createMaterialTopTabNavigator();


  const getstate = async () => {
    setLoading(true);
    let headersList = {
      Accept: "*/*",
      "User-Agent": "Thunder Client (https://www.thunderclient.com)",
    };

    let response = await fetch(
      path + "states.php?case=fetch",
      {
        method: "GET",
        headers: headersList,
      }
    );

    let data = await response.json();

    setstatedata(data)

    setLoading(false);
  };

  useEffect(() => {
    getstate();
  }, []);

  if (loading) {
    return (
      <View style={{  justifyContent: "center", alignItems: "center",marginTop:100 }}>
        <ActivityIndicator size="large" color={Colors.backgroundcolor} />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <HeaderAB title={"Unlock Quest"} notification={true} />

      {statedata ? <Tabs.Navigator
        
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 14,
            textTransform: "capitalize",
            fontWeight: "bold",
            marginTop: 10,
          },
          tabBarStyle: { backgroundColor: "white" },
          tabBarScrollEnabled:true
        }}
      >
        {statedata.map((item, index) => {
          return (
            <Tabs.Screen
              key={index}
              name={item?.state_name}
              children={() => <StateComp item={item} loading={loading} />}
              options={{
                tabBarIcon() {
                  return (
                    <Image
                      source={item.image}
                      style={{ width: 32, height: 32 }}
                    />
                  );
                },
              }}
            />
          );
        })}
      </Tabs.Navigator> : <ActivityIndicator size="large" color={Colors.backgroundcolor} />}
    </View>
  );
};

export default UpComingQuiz;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bglight,
    flex: 1,
  },
  headerTextStyle: {
    color: "black",
  },
  buttonView: {
    width: width1 - 20,
    height: 150,
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    textTransform: "capitalize",
  },
  subView: {
    backgroundColor: "#b3b3b3",
    padding: 5,
    borderRadius: 5,
  },
  ripple: {
    color: Colors.light.background,
  },
  pagerView: {
    flex: 1,
    backgroundColor: "#ccc",
  },
});
