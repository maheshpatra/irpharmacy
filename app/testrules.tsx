import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Link } from "expo-router";

const TestRules = () => {
  console.log("TestRules");

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
      >
        <Text
          style={[
            styles.title,
            { marginTop: "20%", paddingHorizontal: 20,paddingVertical:10, color: "black" },
          ]}
        >
          Rules : --
        </Text>
        <View style={styles.buttonView}>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 1:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Test comprehension and critical thinking, not just recall
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 2:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Use simple sentence structure and precise wording
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 3:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Keep all answer choices the same length
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 4:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Place most of the words in the question stem
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 5:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Make all distractors plausible
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 6:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Test comprehension and critical thinking, not just recall
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 7:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Use simple sentence structure and precise wording
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 8:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Keep all answer choices the same length
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 9:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Place most of the words in the question stem
            </Text>{" "}
          </Text>
          <Text style={[styles.title, { color: "black" }]}>
            Rule 10:
            <Text style={{ fontSize: 16, color: "white", fontWeight: "400" }}>
              {" "}
              Make all distractors plausible
            </Text>{" "}
          </Text>
        </View>
      </ScrollView>
      <Link asChild href={"./start"}>
        <Pressable style={styles.button} android_ripple={styles.ripple}>
          <Text style={[styles.title, { color: "black", marginRight: 10 }]}>
             Start Quiz
          </Text>
          <AntDesign name="doubleright" size={24} color="black" />
        </Pressable>
      </Link>
    </SafeAreaView>
  );
};

export default TestRules;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    width: "100%",
  },
  buttonView: {
    width: "95%",
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
    alignSelf: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
  },
  subView2: {
    // backgroundColor:'#1a1a1a',
    borderRadius: 5,
    margin: 5,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
  },
  startButton: {
    width: "30%",
    height: 40,
    padding: 5,
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    right: 20,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  ripple: {
    color: Colors.light.background,
  },
});
