import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Image,
  SafeAreaView,
  ScrollView, ProgressBarAndroid, FlatList, Alert, ActivityIndicator
} from "react-native";
import Colors from "../constants/Colors";
import { FontAwesome, Octicons } from "@expo/vector-icons";
import {  Checkbox, TextInput } from "react-native-paper";
import { Link, router, useLocalSearchParams } from "expo-router";
import HeaderAB from "../components/HeaderAB";
import { path } from "../components/server";
import { getpercent } from "../utils";
import { _retrieveData } from "../local_storage";

const RankingDetails = () => {
  const prize = useLocalSearchParams()
  const { pool_prize } = prize;
  const [pollPrizes, setPullPrices] = useState([]);
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(false);
  console.log(prize);
  const percent = getpercent(prize.total_seats, prize.total_seats - prize.available_seats)

  useEffect(() => {
    setPullPrices(JSON.parse(pool_prize))
  }, [])

  useEffect(() => {

    _retrieveData("USER_DATA").then((userdata) => {
      console.log(userdata);
      if (userdata && userdata !== 'error') {
        setuser(userdata.mobile)
        // joinpoll(prize.id, userdata.mobile, prize.entry_fee)

      } else {
        alert('user not found');
      }

    });
  }, [])

  useEffect(() => {
    console.log(getpercent(prize.total_seats, prize.available_seats))
  }, [])

  const joinpoll = async (pollid, number, amount) => {
    setLoading(true)
    const fd = new FormData();
    fd.append("case", 'postuser')
    fd.append("mobile", number)
    fd.append("id", pollid)
    fd.append("amount", amount)
    try {
      const req = await fetch(path + "pool.php", {
        body: fd,
        method: 'post'
      })
      let res = await req.json();
      console.log(res)
      setLoading(false)
      if(!res.error){
        router.replace('/home')
      }else{
        setLoading(false)
        Alert.alert('Error',res.message)
      }

    } catch (err) {
      console.log(JSON.stringify(err, null, 2));
    }


  }


  return (
    <View style={styles.container}>
      <HeaderAB title={'Prize Details'} />
      <ScrollView
        style={{ width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable style={[styles.buttonView]}>
          <View style={[styles.subView]}>
            <Text style={styles.title}>Current Prize Pool</Text>
            <Text style={styles.title}>Prize Pool</Text>
          </View>
          <View style={[styles.subView, { marginVertical: 10 }]}>
            <Text style={styles.title}>Total {prize.total_seats} seats</Text>

            <Text style={[styles.title, { fontSize: 16 }]}>10000 QC</Text>
          </View>
          <ProgressBarAndroid
            styleAttr="Horizontal"
            color={'#fff'}
            indeterminate={false}
            progress={getpercent(prize.total_seats, prize.available_seats)}
          />
          {/* <Link asChild href={"./registerconfirm"}> */}
          <Pressable
            onPress={()=>joinpoll(prize.id, user, prize.entry_fee)}
            style={{
              width: "95%",
              height: 40,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
              backgroundColor: Colors.backgroundcolor,
              borderRadius: 5,
              marginVertical: 15,
              borderWidth: 1,
              borderColor: "#fff",
            }}
          >
            {!loading?<Text style={styles.title}>Join for {prize.entry_fee} QC</Text>:
            <ActivityIndicator color={'#fff'} size={'small'}/>
            }
          </Pressable>
          {/* </Link> */}

          <View
            style={[styles.subView, { marginRight: 10, marginVertical: 10 }]}
          >
            <Text style={styles.title3}>1st Prize {pollPrizes[0]?.amount} QC</Text>
            <Text style={styles.title3}>winner upto 10</Text>
          </View>
        </Pressable>
        <View style={[styles.buttonView, {}]}>
          <Text style={[styles.title, { textAlign: "left", marginBottom: 10 }]}>
            Winning
          </Text>
          <FlatList
            data={pollPrizes}
            renderItem={({ item, index }) =>
              <View style={styles.subView2}>
                <Octicons name="dot-fill" size={24} color="white" />
                <Text style={[styles.title3, { marginLeft: 5 }]}>
                  {index + 1} Rank : {item.amount} QC
                </Text>
              </View>
            }

          />





        </View>
      </ScrollView>
    </View>
  );
};

export default RankingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bglight
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  title2: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
  title3: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  subView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subView2: {
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-evenly",
  },

  ripple: {
    color: Colors.light.background,
  },
});
