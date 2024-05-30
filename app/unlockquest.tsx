import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,FlatList, TouchableOpacity
} from "react-native";
import Colors from "../constants/Colors";
import { AntDesign } from "@expo/vector-icons";
import { Checkbox, TextInput, Title } from "react-native-paper";
import { Link, router } from "expo-router";
import HeaderAB from "../components/HeaderAB";

const width1 = Dimensions.get("window").width;






const UnlockQuest = () => {

  const [examdata, setExamdata] = useState([])
  const [loading, setloading] = useState(false)

  console.log("UnlockQuest");
  const getExam = async () => {
    setloading(true)
    let response = await fetch("https://dipantan.online/irpharmacy/series.php?case=get_exams", {
      method: "GET"
    });

    let data = await response.json();
    setloading(false)
    console.log(data);
    if (!data.error) {
      setExamdata(data.data)
    }
  }

  useEffect(() => {
    getExam()
  }, [])

  return (
    <View style={styles.container}>
      <HeaderAB title={"Exmination Series"} notification={true} />

      <Title
        style={{ textAlign: "center", marginVertical: 10, fontWeight: "bold" }}
      >
        Choose your exam
      </Title>
      <FlatList
        data={examdata}
        renderItem={({item,index}) =>
        <TouchableOpacity onPress={() => router.push({ pathname: `/test`, params: { examid:item.id,examname:item.name } })} style={{ width: '94%', flexDirection: 'row', alignSelf: 'center', margin: 5, backgroundColor: '#fff', padding: 18, elevation: 5, borderRadius: 5, }}>
        <View style={{ height: 80, width: 80, borderRadius: 15, backgroundColor: Colors.bglight, justifyContent: 'center', alignItems: 'center' }} >
          <Text style={{color:Colors.backgroundcolor,textAlign:'center',fontWeight:'bold',fontSize:18}}>{"Entry Fee\n"+'free'}</Text>
        </View>

        <View style={{marginLeft:10}}>
        <Text style={{ color: '#555', fontWeight: 'bold', fontSize: 18, }}>{item.name}</Text>
        <Text style={{ color: '#ccc', fontWeight: 'bold', fontSize: 16,marginTop:10 }}>{'Some other description'}</Text>

        </View>
        

      </TouchableOpacity>
        }
      />
    </View>
  );
};

export default UnlockQuest;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonView: {
    width: width1 - 20,
    alignSelf: "center",
    marginVertical: 10,
    elevation: 5,
    backgroundColor: "#2f95dc",
    padding: 15,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "left",
  },
  subView2: {
    backgroundColor: Colors.backgroundcolor,
    borderRadius: 5,
    margin: 5,
    padding: 10,
  },
  button: {
    position: "absolute",
    right: 20,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.backgroundcolor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  ripple: {
    color: Colors.light.background,
  },
});
